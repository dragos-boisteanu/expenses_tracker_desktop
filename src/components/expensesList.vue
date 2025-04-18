<script setup lang="ts">
import ExpenseComponent from '@/components/expenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import DeleteExpenseDialog from '@/components/deleteExpenseDialog.vue'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'

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
  <div class="size-full rounded-2xl bg-transparent">
    <delete-expense-dialog
      v-if="showDeleteDialog"
      @close="closeDeleteDialog"
      :expense="selectedExpense"
    />
    <OverlayScrollbarsComponent
      class="h-fit max-h-full overflow-y-auto rounded-2xl bg-neutral-50 p-2 shadow dark:bg-neutral-800"
      defer
      element="div"
      :options="{ scrollbars: { autoHide: 'never' } }"
    >
      <expense-component
        :date="expense.date"
        :value="expense.value"
        :currency="expense.currency"
        :previousDate="getPreviousDate(index)"
        v-for="(expense, index) in expensesStore.list"
        :key="expense.id"
        @select="handleExpenseSelected(expense)"
      />
    </OverlayScrollbarsComponent>
  </div>
</template>

<style scoped></style>
