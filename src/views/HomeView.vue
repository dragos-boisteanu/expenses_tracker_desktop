<script setup lang="ts">
import ExpenseComponent from '@/components/ExpenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses.ts'
import AddExpenseComponent from '@/components/addExpenseComponent.vue'
import ThemeToggleComponent from '@/components/themeToggleComponent.vue'

const expensesStore = useExpensesStore()

const getPreviousDate = (index: number) => {
  let date

  if (expensesStore.list[index + 1]) {
    date = expensesStore.list[index + 1].date
  }

  return date
}
</script>

<template>
  <div class="flex size-full flex-1 flex-col items-center bg-neutral-100 dark:bg-neutral-900">
    <div class="flex h-12 w-full items-center justify-end p-4">
      <theme-toggle-component />
    </div>

    <div class="flex size-full flex-col items-center gap-6 pt-16 pb-4 lg:w-2/5 xl:w-1/4">
      <div class="w-full px-4">
        <add-expense-component />
      </div>

      <div
        v-if="expensesStore.list.length > 0"
        class="w-full flex-1 basis-0 overflow-hidden rounded-2xl px-4"
      >
        <div
          class="h-fit max-h-full w-full overflow-y-auto rounded-2xl bg-neutral-50 shadow dark:bg-neutral-800"
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
  </div>
</template>
