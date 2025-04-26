import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'

export const useExpensesStore = defineStore('expenses', () => {
  const list = ref<ViewExpense[]>([])

  const setList = (expenses: ViewExpense[]) => (list.value = expenses)
  const add = (expense: ViewExpense) => {
    list.value.unshift(expense)
  }
  const addExpenses = (expenses: ViewExpense[]) => {
    list.value.push(...expenses)
  }

  const remove = (expenseId: string) => {
    const index: number = list.value.findIndex((expense: ViewExpense) => expenseId === expense.id)

    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  return { list, setList, addExpenses, add, remove }
})
