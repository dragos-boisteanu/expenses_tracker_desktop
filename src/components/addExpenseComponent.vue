<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { inject, onMounted, ref } from 'vue'
import type { ExpensesService } from '@/services/expensesService'
import type { Country } from '@/types/country'
import CountrySelectComponent from '@/components/countrySelectComponent.vue'
import { ActionResult } from '@/types/actionResult'

const expensesService = inject<ExpensesService>('expensesService')!
const value = ref<string>('0')
const hasError = ref<ActionResult>({
  show: false,
})
const isSuccess = ref<ActionResult>({
  show: false,
})

const successTimeout = ref<number>(0)

const addExpense = async () => {
  const regex = /^[-]?[0-9.,]+$/g

  clearTimeout(successTimeout.value)

  if (regex.test(value.value)) {
    try {
      const numericValue: number = parseFloat(value.value.replace(',', '.'))
      if (numericValue === 0) {
        throw new Error('Expense might have a value, either negative or positive')
      }
      await expensesService.addExpense(numericValue, selectedCountry.value.code)
      value.value = '0'
      hasError.value.show = false
      isSuccess.value.show = true

      successTimeout.value = window.setTimeout(() => (isSuccess.value.show = false), 1000)
    } catch (error) {
      console.error('addExpenseError', error)
      hasError.value.show = true
    }
  } else {
    hasError.value.show = true
    hasError.value.message = 'Invalid input'
  }
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
  <div class="flex w-full shrink-0 grow-0 flex-col items-center gap-4">
    <div
      class="flex h-fit w-full items-center gap-x-4 rounded-2xl border-2 border-transparent bg-neutral-50 p-4 shadow transition-[border] duration-500 ease-in-out dark:bg-neutral-800"
      :class="{
        'border-b-indigo-600 dark:border-b-indigo-500': isInputFocused,
        'border-b-red-500': hasError.show,
        'border-b-green-500': isSuccess.show,
      }"
    >
      <input
        ref="inputRef"
        v-model.trim="value"
        class="size-full rounded-2xl bg-transparent text-xl text-gray-700 outline-none dark:text-gray-200"
        type="text"
        placeholder="Enter value"
      />
      <country-select-component @countrySelected="handleCountrySelected" />
    </div>

    <button
      @click="addExpense"
      class="group flex size-16 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
    >
      <PlusIcon class="size-10 text-neutral-50 group-hover:text-neutral-100" />
    </button>
  </div>
</template>

<style scoped></style>
