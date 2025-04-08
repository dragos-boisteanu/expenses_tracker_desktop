<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import ExpenseComponent from '@/components/ExpenseComponent.vue'
import { inject, onMounted, ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses.ts'
import type { ExpensesService } from '@/services/expensesService.ts'

const value = ref(0)
const expensesStore = useExpensesStore()
const expensesService = inject<ExpensesService>('expensesService')!

onMounted(() => {
  expensesService.getExpenses()
})

const getPreviousDate = (index: number) => {
  let date

  if (expensesStore.list[index + 1]) {
    date = expensesStore.list[index + 1].date
  }

  return date
}
const addExpense = () => {
  expensesService.addExpense(value.value)
  value.value = 0
}
</script>

<template>
  <div class="flex h-full flex-1 flex-col items-center bg-neutral-100">
    <div class="flex size-full flex-col items-center gap-6 p-8 pt-36 lg:w-2/5 xl:w-1/4">
      <div class="flex w-full shrink-0 grow-0 flex-col items-center gap-6">
        <div class="h-fit w-full rounded-2xl bg-neutral-50">
          <input
            v-model.number="value"
            class="size-full rounded-2xl border-2 border-transparent bg-transparent p-4 text-xl text-gray-700 shadow outline-none focus:border-b-indigo-600"
            type="text"
            inputmode="decimal"
            placeholder="Enter value"
          />
        </div>
        <button
          @click="addExpense"
          class="group flex size-18 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
        >
          <PlusIcon class="size-12 text-neutral-50 group-hover:text-neutral-100" />
        </button>
      </div>
      <div
        v-if="expensesStore.list.length > 0"
        class="w-full overflow-y-auto rounded-2xl bg-neutral-50 p-4 shadow"
      >
        <expense-component
          :date="expense.date"
          :value="expense.value"
          :previousDate="getPreviousDate(index)"
          v-for="(expense, index) in expensesStore.list"
          :key="expense.id"
        />
      </div>
    </div>
  </div>
</template>
