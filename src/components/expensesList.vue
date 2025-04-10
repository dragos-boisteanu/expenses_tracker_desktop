<script setup lang="ts">
import ExpenseComponent from '@/components/ExpenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses.ts'
import DeleteExpenseDialog from '@/components/deleteExpenseDialog.vue'
import { ref } from 'vue'
import type { Expense } from '@/types/expense.ts'
import type { ViewExpense } from '@/types/viewExpense.ts'

const expensesStore = useExpensesStore()
const getPreviousDate = (index: number) => {
  let date

  if (expensesStore.list[index + 1]) {
    date = expensesStore.list[index + 1].date
  }

  return date
}

const showDeleteDialog = ref<boolean>(false)
const selectedExpense = ref<ViewExpense>({
  id: '',
  value: '',
  currency: '',
  date: '',
})

const handleExpenseSelected = (expense: ViewExpense) => {
  selectedExpense.value = expense
  showDeleteDialog.value = true
}
const closeDeleteDialog = () => {
  selectedExpense.value = {
    id: '',
    value: '',
    currency: '',
    date: '',
  }
  showDeleteDialog.value = false
}
</script>

<template>
  <div
    class="h-fit max-h-full w-full overflow-y-auto rounded-2xl bg-neutral-50 p-2 shadow dark:bg-neutral-800"
  >
    <delete-expense-dialog
      v-if="showDeleteDialog"
      @close="closeDeleteDialog"
      :expense="selectedExpense"
    />

    <expense-component
      :date="expense.date"
      :value="expense.value"
      :currency="expense.currency"
      :previousDate="getPreviousDate(index)"
      v-for="(expense, index) in expensesStore.list"
      :key="expense.id"
      @select="handleExpenseSelected(expense)"
    />
  </div>
</template>

<style scoped></style>
