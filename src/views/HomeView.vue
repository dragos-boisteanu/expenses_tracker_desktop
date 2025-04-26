<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'
import AddExpenseComponent from '@/components/addExpenseComponent.vue'
import ThemeToggleComponent from '@/components/themeToggleComponent.vue'
import ExpensesList from '@/components/expensesList.vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const expensesStore = useExpensesStore()
const version = import.meta.env.VITE_APP_VERSION

const closeApp = () => {
  window['app']?.close()
}
</script>

<template>
  <div class="flex size-full flex-1 flex-col items-center bg-neutral-100 pt-0 dark:bg-neutral-900">
    <div class="drag flex h-12 w-full items-center justify-between gap-x-4 px-6 pt-8 pb-4">
      <theme-toggle-component class="drag--disabled" />
      <button class="drag--disabled group size-6 cursor-pointer rounded-full" @click="closeApp">
        <XMarkIcon
          class="size-fit rounded-full text-neutral-800 group-hover:text-red-600 group-active:text-red-700 dark:text-neutral-300"
        />
      </button>
    </div>

    <div class="flex size-full flex-col items-center gap-4 px-6 py-4">
      <div class="w-full">
        <add-expense-component />
      </div>

      <div v-if="expensesStore.list.length > 0" class="w-full flex-1 rounded-2xl">
        <expenses-list />
      </div>

      <div class="w-full text-right text-xs text-neutral-700 dark:text-neutral-400">
        v{{ version }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
