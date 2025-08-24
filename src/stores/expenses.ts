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

  const importExpenses = (expenses: ViewExpense[]) => {
    list.value.push(...expenses)
    list.value = list.value.sort((a, b) => b.unixDate - a.unixDate)
  }

  const remove = (expenseId: number) => {
    const index: number = list.value.findIndex((expense: ViewExpense) => expenseId === expense.id)

    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  const isDeletingAllData = ref<boolean>(false)
  const deleteAllData = () => {
    list.value = []
  }
  const setIsDeletingAllData = (payload: boolean) => {
    isDeletingAllData.value = payload
  }
  return {
    list,
    setList,
    addExpenses,
    importExpenses,
    add,
    remove,
    deleteAllData,
    isDeletingAllData,
    setIsDeletingAllData,
  }
})
