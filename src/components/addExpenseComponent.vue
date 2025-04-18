<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { inject, onMounted, ref } from 'vue'
import type { ExpensesService } from '@/services/expensesService'
import type { Country } from '@/types/country'
import CountrySelectComponent from '@/components/countrySelectComponent.vue'

const expensesService = inject<ExpensesService>('expensesService')!
const value = ref(0)

const addExpense = () => {
  console.log('selectedCountry', selectedCountry)
  expensesService.addExpense(value.value, selectedCountry.value.code)
  value.value = 0
}

const selectedCountry = ref<Country | null>(null)
const handleCountrySelected = (country: Country) => {
  selectedCountry.value = country
}
const isInputFocused = ref<boolean>(false)
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => {
  inputRef.value.addEventListener('focus', () => {
    isInputFocused.value = true
  })
  inputRef.value.addEventListener('blur', () => {
    isInputFocused.value = false
  })
})
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
      <country-select-component @countrySelected="handleCountrySelected" />
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
