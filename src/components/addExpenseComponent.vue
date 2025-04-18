<script setup lang="ts">
import { PlusIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { inject, onMounted, ref } from 'vue'
import type { ExpensesService } from '@/services/expensesService'
import type { Country } from '@/types/country'

const expensesService = inject<ExpensesService>('expensesService')!
const value = ref(0)

const addExpense = () => {
  expensesService.addExpense(value.value, selectedCountry.value.code)
  value.value = 0
}

const countries = ref<Country[]>([])
const selectedCountry = ref<Country | null>(null)
const getCountries = async () => {
  try {
    const response = await fetch('/data/countries.json')
    countries.value = await response.json()
    selectedCountry.value = countries.value.find((country) => country.code === 'RON')
  } catch (error) {
    console.error('Failed to load countries', error)
  }
}
const selectCountry = (country: Country) => {
  selectedCountry.value = country
  toggleCountriesList()
}

const isInputFocused = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  getCountries()

  inputRef.value.addEventListener('focus', () => {
    isInputFocused.value = true
  })
  inputRef.value.addEventListener('blur', () => {
    isInputFocused.value = false
  })
})

const showCountriesList = ref<boolean>(false)
const toggleCountriesList = () => {
  showCountriesList.value = !showCountriesList.value
}
</script>

<template>
  <div class="flex w-full shrink-0 grow-0 flex-col items-center gap-6">
    <div
      class="flex h-fit w-full items-center gap-x-4 rounded-2xl border-2 border-transparent bg-neutral-50 p-4 shadow dark:bg-neutral-800"
      :class="{ 'border-b-indigo-600 dark:border-b-indigo-500': isInputFocused }"
    >
      <input
        ref="inputRef"
        v-model.number="value"
        class="size-full rounded-2xl bg-transparent text-xl text-gray-700 outline-none dark:text-gray-200"
        type="text"
        inputmode="decimal"
        placeholder="Enter value"
      />
      <div class="h-ful relative" v-if="selectedCountry">
        <button class="flex cursor-pointer items-center gap-2" @click="toggleCountriesList">
          <img :src="selectedCountry.flag" class="size-6 flex-1" />
          <ChevronDownIcon class="size-4 shrink-0 grow-0 text-neutral-800" />
        </button>
        <div
          v-if="showCountriesList"
          class="absolute top-0 -left-12 z-10 h-64 overflow-y-auto rounded-2xl bg-neutral-50 shadow"
        >
          <button
            @click="selectCountry(country)"
            v-for="country in countries"
            :key="country.code"
            class="flex cursor-pointer items-center gap-2 p-2 hover:bg-neutral-100"
            :class="{ 'bg-neutral-100': selectedCountry.code === country.code }"
          >
            <div class="min-w-9 shrink-0 text-left">{{ country.code }}</div>
            <img :src="country.flag" class="size-6 flex-1" />
          </button>
        </div>
      </div>
    </div>
    <button
      @click="addExpense"
      class="group flex size-18 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
    >
      <PlusIcon class="size-12 text-neutral-50 group-hover:text-neutral-100" />
    </button>
  </div>
</template>

<style scoped></style>
