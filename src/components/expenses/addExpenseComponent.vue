<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import type { Country } from '@/types/country'
import CountrySelectComponent from '@/components/countrySelectComponent.vue'
import type { ActionResult } from '@/types/actionResult'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseDescriptionInput from '@/components/expenses/expenseDescriptionInput.vue'
import { JSONContent } from '@tiptap/vue-3'

const value = ref<number | null>(null)
const hasError = ref<ActionResult>({
  show: false,
})
const isSuccess = ref<ActionResult>({
  show: false,
})

const successTimeout = ref<number>(0)
const errorTimeout = ref<number>(0)

const addExpense = async (event: never | null, description?: JSONContent) => {
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
    if (Number.isNaN(numericValue)) {
      throw new Error('Expense value must be a number')
    }
    if (numericValue === 0) {
      throw new Error('Expense might have a value, either negative or positive')
    }

    const expenseStore = useExpensesStore()
    await expenseStore.addExpense(numericValue, selectedCountry.value.code, description)
    value.value = null
    hasError.value.show = false
    isSuccess.value.show = true

    showExtraDetailsDialog.value = false
    successTimeout.value = window.setTimeout(() => {
      isSuccess.value.show = false
    }, 1000)
  } catch (error) {
    console.error('addExpenseError', error)
    hasError.value.show = true
    errorTimeout.value = window.setTimeout(() => {
      hasError.value.show = false
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
  <div class="flex w-full shrink-0 grow-0 flex-col items-center gap-4">
    <div class="relative w-full">
      <div
        class="flex w-full items-center gap-x-2 border-b-2 border-transparent bg-neutral-50 p-4 shadow transition-all duration-300 ease-in-out dark:bg-neutral-800"
        :class="[
          value ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl',
          {
            'border-b-red-500!': hasError.show && !value,
            'border-b-green-500!': isSuccess.show && !value,
          },
        ]"
      >
        <input
          @keydown="(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()"
          class="size-full bg-transparent text-xl text-gray-700 outline-none dark:text-gray-200"
          v-model.trim="value"
          type="number"
          placeholder="Enter value"
          @keydown.enter="addExpense"
        />
        <country-select-component @countrySelected="handleCountrySelected" />
      </div>

      <Transition name="slide-down">
        <div
          v-if="value"
          @click="toggleExtraDetailsDialog"
          class="absolute top-full left-0 z-10 w-full cursor-pointer overflow-hidden rounded-b-2xl border-b-2 border-transparent bg-indigo-600 p-0.5 text-center text-xs text-neutral-50 shadow transition-colors hover:bg-indigo-700 active:bg-indigo-500"
        >
          Description
        </div>
      </Transition>
    </div>

    <!-- 3. Plus Button -->
    <button
      @click="addExpense"
      class="group mt-3 flex size-16 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
    >
      <PlusIcon class="size-10 text-neutral-50 group-hover:text-neutral-100" />
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
