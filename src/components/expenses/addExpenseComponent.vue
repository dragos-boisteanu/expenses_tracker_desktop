<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import type { Country } from '@/types/country'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseDescriptionInput from '@/components/expenses/expenseDescriptionInput.vue'
import { JSONContent } from '@tiptap/vue-3'
import ExpenseValueInput from '@/components/expenses/expenseValueInput.vue'
import { DescriptionAndDateType } from '@/types/descriptionAndDateType'
import { useToastStore } from '@/stores/toast'

const value = ref<number | null>(null)
const hasError = ref<boolean>(false)
const isSuccess = ref<boolean>(false)

const successTimeout = ref<number>(0)
const errorTimeout = ref<number>(0)

const addExpense = async (event: never | null, payload?: DescriptionAndDateType) => {
  if (!selectedCountry.value) {
    return
  }

  clearTimeout(successTimeout.value)
  clearTimeout(errorTimeout.value)

  let numericValue: number | null
  if (typeof value.value === 'string') {
    numericValue = parseFloat(value.value)
  } else {
    numericValue = value.value
  }

  try {
    if (Number.isNaN(numericValue) || !numericValue) {
      throw new Error('Expense value must be a number', {
        cause: 'message',
      })
    }

    console.log('numericValue', numericValue)

    if (numericValue === 0) {
      throw new Error('Expense must have a positive value', {
        cause: 'message',
      })
    }

    let description: JSONContent
    let date: number
    if (payload) {
      description = payload.description
      date = payload.date
    }

    const expenseStore = useExpensesStore()
    await expenseStore.addExpense(numericValue, selectedCountry.value.code, date, description)

    value.value = null
    hasError.value = false
    isSuccess.value = true

    showExtraDetailsDialog.value = false
    successTimeout.value = window.setTimeout(() => {
      isSuccess.value = false
    }, 1000)
  } catch (error) {
    console.error('addExpenseError', error)

    const toastStore = useToastStore()
    if (error.cause === 'message') {
      toastStore.add({
        text: error.message,
      })
    } else {
      toastStore.add({
        text: 'Failed to add expense',
      })
    }

    hasError.value = true
    errorTimeout.value = window.setTimeout(() => {
      hasError.value = false
    }, 1000)
  }
}

const selectedCountry = ref<Country | null>(null)
const handleCountrySelected = (country: Country) => {
  selectedCountry.value = country
}

const showExtraDetailsDialog = ref(false)
const toggleExtraDetailsDialog = () => {
  showExtraDetailsDialog.value = !showExtraDetailsDialog.value
}
</script>

<template>
  <expense-description-input
    v-if="showExtraDetailsDialog"
    @close="toggleExtraDetailsDialog()"
    @add="addExpense(null, $event)"
  />

  <div class="relative w-full shrink-0 grow-0 flex items-center gap-x-3 bg-transparent">
    <div
      class="relative w-full rounded-2xl bg-white shadow-sm dark:bg-neutral-900 border
        border-slate-200/80 dark:border-neutral-800 z-10"
    >
      <expense-value-input
        v-model="value"
        :error="hasError"
        :success="isSuccess"
        @add="addExpense(null)"
        @countrySelected="handleCountrySelected"
      />

      <!-- Description & Date Bar: Absolutely positioned directly under input box inside the reserved 92px height -->
      <Transition name="slide-down">
        <button
          v-if="value"
          type="button"
          @click="toggleExtraDetailsDialog"
          class="absolute top-full left-0 z-10 flex w-full items-center justify-center gap-2
            overflow-hidden rounded-b-2xl border-t border-indigo-200/50 py-2.5 text-xs font-semibold
            text-indigo-600 bg-indigo-100/70 hover:bg-indigo-100 dark:border-neutral-800/80
            dark:bg-indigo-500/15 dark:text-indigo-400 dark:hover:bg-indigo-500/25 transition-all
            duration-150 cursor-pointer active:scale-[0.99] focus:outline-none select-none"
        >
          <svg class="size-3.5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Description & Date</span>
        </button>
      </Transition>
    </div>

    <button
      type="button"
      @click="addExpense"
      class="group flex size-12 shrink-0 items-center justify-center rounded-2xl cursor-pointer
        bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500
        hover:shadow-indigo-500/35 active:bg-indigo-700 active:scale-90 dark:shadow-indigo-950/60
        dark:hover:shadow-indigo-900/70 transition-all duration-150 ease-out select-none
        focus:outline-none focus-visible:ring-indigo-500 z-10"
    >
      <PlusIcon
        class="size-6 stroke-2 text-white transition-transform duration-150 group-hover:scale-110"
      />
    </button>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    max-height 0.3s ease-out,
    opacity 0.3s ease-out;
  max-height: 40px; /* Adjust this to slightly more than the button's actual height */
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
