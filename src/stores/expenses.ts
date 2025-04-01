import {defineStore} from "pinia";
import {ref} from "vue";
import {type  Expense} from "../types/expense.ts"

export const expensesStore = defineStore('expenses', () => {
  const list  = ref<Expense[]>([])

  const add = (expense: Expense) => {
    list.value.unshift(expense)
  }

  const remove = (expenseId: string) => {
    const index: number = list.value.findIndex((expense: Expense) => expenseId === expense.id)

    if(index > -1) {
      list.value.splice(index, 1)
    }
  }

  return {list, add, remove}
})
