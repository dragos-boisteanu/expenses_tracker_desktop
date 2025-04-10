<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses.ts'
import AddExpenseComponent from '@/components/addExpenseComponent.vue'
import ThemeToggleComponent from '@/components/themeToggleComponent.vue'
import ExpensesList from '@/components/expensesList.vue'

const expensesStore = useExpensesStore()
</script>

<template>
  <div class="flex size-full flex-1 flex-col items-center bg-neutral-100 dark:bg-neutral-900">
    <div class="flex h-12 w-full items-center justify-end p-4">
      <theme-toggle-component />
    </div>

    <div class="flex size-full flex-col items-center gap-6 pt-16 pb-2 lg:w-2/5 xl:w-1/4">
      <div class="w-full px-6">
        <add-expense-component />
      </div>

      <div
        v-if="expensesStore.list.length > 0"
        class="w-full flex-1 basis-0 overflow-hidden rounded-2xl px-6 pb-4"
      >
        <expenses-list />
      </div>
    </div>
  </div>
</template>
