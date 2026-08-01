<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import type { Country } from '@/types/country'
import { onClickOutside } from '@vueuse/core'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import { VList } from 'virtua/vue'

const props = withDefaults(
  defineProps<{
    currency?: string
    isEditing?: boolean
  }>(),
  {
    isEditing: false,
  },
)

const emits = defineEmits<{
  (e: 'countrySelected', value: Country): void
}>()

const countries = ref<Country[]>([])
const countrySearchInput = ref<string>('')
const filteredCountries = computed(() => {
  if (!countrySearchInput.value) {
    return countries.value
  }

  return countries.value.filter((country) =>
    country.code.includes(countrySearchInput.value.toUpperCase()),
  )
})
const countriesListRef = ref<HTMLInputElement | null>(null)

const [initializeScrollbars] = useOverlayScrollbars({
  defer: true,
  options: {
    scrollbars: {
      visibility: 'visible',
    },
    overflow: {
      x: 'hidden',
      y: 'scroll',
    },
  },
})

watch(
  () => filteredCountries.value,
  (value) => {
    const valuesCount = value.length
    if (rootRef.value)
      if (valuesCount < 5) {
        rootRef.value.style.height = `${valuesCount * 40}px`
      } else {
        rootRef.value.style.height = '200px'
      }
  },
)

const selectedCountry = ref<Country | null>(null)

const getCountries = async () => {
  try {
    const response = await fetch('data/countries.json')
    countries.value = await response.json()

    const selectedCountryCode =
      props.currency || localStorage.getItem('selectedCountryCode') || 'RON'

    const defaultSelectedCountry = countries.value.find(
      (country) => country.code === selectedCountryCode,
    )

    selectCountry(defaultSelectedCountry)
  } catch (error) {
    console.error('Failed to load countries', error)
  }
}

const selectCountry = (country: Country) => {
  selectedCountry.value = country

  if (!props.isEditing) {
    localStorage.setItem('selectedCountryCode', country.code)
  }

  emits('countrySelected', country)
  if (showCountriesList.value) {
    toggleCountriesList()
  }
}
const showCountriesList = ref<boolean>(false)
const toggleCountriesList = async () => {
  if (showCountriesList.value) {
    countrySearchInput.value = ''
    showCountriesList.value = false
  } else {
    showCountriesList.value = true
    await nextTick()

    if (countrySearchInputRef.value) {
      countrySearchInputRef.value.focus()
    }

    const root = rootRef.value
    if (!root) return

    initializeScrollbars({
      target: root,
      elements: {
        viewport: root.firstElementChild as HTMLElement,
      },
    })
  }
}

const rootRef = ref<HTMLDivElement | null>(null)
const countrySearchInputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  getCountries()
  onClickOutside(countriesListRef, () => (showCountriesList.value = false))
})
</script>

<template>
  <div class="h-ful relative" v-if="selectedCountry">
    <button class="flex cursor-pointer items-center gap-2" @click="toggleCountriesList">
      <img :src="selectedCountry.flag" class="size-6" />
      <ChevronDownIcon class="size-5 text-neutral-800 dark:text-neutral-300" />
    </button>
    <div
      ref="countriesListRef"
      v-show="showCountriesList"
      class="absolute top-0 -left-12 z-10 w-24 overflow-hidden rounded-2xl bg-neutral-100 shadow dark:bg-neutral-700"
    >
      <div class="p-2">
        <input
          ref="countrySearchInputRef"
          v-model="countrySearchInput"
          :placeholder="selectedCountry?.code"
          type="text"
          class="sticky w-full rounded-md border-neutral-600 bg-neutral-50 p-1 text-sm shadow outline-none dark:bg-neutral-600 dark:text-gray-100"
        />
      </div>

      <div ref="rootRef" data-overlayscrollbars-initialize="" class="h-50">
        <VList :data="filteredCountries" :style="{ height: 'none' }" #default="{ item }">
          <button
            @click="selectCountry(item)"
            class="flex w-full cursor-pointer items-center gap-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600/50"
            :class="{
              'bg-neutral-100 dark:bg-neutral-600/50': selectedCountry.code === item.code,
            }"
          >
            <div class="min-w-9 shrink-0 text-left text-sm text-gray-700 dark:text-neutral-300">
              {{ item.code }}
            </div>
            <img :src="item.flag" class="size-6" />
          </button>
        </VList>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
