import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense.ts'

export const useExpensesStore = defineStore('expenses', () => {
  const list = ref<ViewExpense[]>([])

  const setList = (expenses: ViewExpense[]) => (list.value = expenses)
  const add = (expense: ViewExpense) => {
    list.value.unshift(expense)
  }

  const remove = (expenseId: string) => {
    const index: number = list.value.findIndex((expense: ViewExpense) => expenseId === expense.id)

    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  return { list, setList, add, remove }
})
