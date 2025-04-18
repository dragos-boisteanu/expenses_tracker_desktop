<script setup lang="ts">
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, onMounted, ref } from 'vue'
import type { Country } from '@/types/country'
import { onClickOutside } from '@vueuse/core'
const countriesListRef = ref<HTMLInputElement | null>(null)
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

const emits = defineEmits(['countrySelected'])

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
const selectedCountry = ref<Country | null>(null)
const getCountries = async () => {
  try {
    const response = await fetch('data/countries.json')
    countries.value = await response.json()

    const selectedCountryCode = localStorage.getItem('selectedCountryCode') || 'RON'
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
  localStorage.setItem('selectedCountryCode', country.code)
  emits('countrySelected', country)
  if (showCountriesList.value) {
    toggleCountriesList()
  }
}
const showCountriesList = ref<boolean>(false)
const toggleCountriesList = () => {
  showCountriesList.value = !showCountriesList.value

  if (!showCountriesList.value) {
    countrySearchInput.value = ''
  }
}
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
      v-if="showCountriesList"
      class="absolute top-0 -left-12 z-10 w-24 overflow-hidden rounded-2xl bg-neutral-100 shadow dark:bg-neutral-700"
    >
      <div class="p-2">
        <input
          v-model="countrySearchInput"
          :placeholder="selectedCountry?.code"
          type="text"
          class="sticky w-full rounded-md border-neutral-600 bg-neutral-50 p-1 text-sm shadow outline-none dark:bg-neutral-600 dark:text-gray-100"
        />
      </div>
      <OverlayScrollbarsComponent
        class="max-h-64"
        defer
        element="div"
        :options="{ scrollbars: { autoHide: 'never' } }"
      >
        <button
          @click="selectCountry(country)"
          v-for="country in filteredCountries"
          :key="country.code"
          class="flex w-full cursor-pointer items-center gap-2 p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600/50"
          :class="{
            'bg-neutral-100 dark:bg-neutral-600/50': selectedCountry.code === country.code,
          }"
        >
          <div class="min-w-9 shrink-0 text-left text-gray-700 dark:text-neutral-300">
            {{ country.code }}
          </div>
          <img :src="country.flag" class="size-6" />
        </button>
      </OverlayScrollbarsComponent>
    </div>
  </div>
</template>

<style scoped></style>
