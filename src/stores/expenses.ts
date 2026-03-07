import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import type { Expense } from '@/types/expense'
import { formatExpense } from '@/helpers/formatExpense'
import dayjs from '@/plugins/dayjs'
import currencyFormat from '@/helpers/currencyFormat'
import getLocale from '@/helpers/getLocale'
import ExpensesDB from '@/repositories/ExpensesDB'
import { ExpenseForDateType } from '@/types/ExpenseForDateType'

export const useExpensesStore = defineStore('expenses', () => {
  const list = ref<ViewExpense[]>([])
  const isDeletingAllData = ref<boolean>(false)

  let offset: number = 0
  const limit: number = 15
  const allLoaded = ref<boolean>(false)
  const getExpenses = async (
    firstPage: boolean = false,
    nextPage: boolean = false,
  ): Promise<void> => {
    try {
      if (firstPage) {
        allLoaded.value = false
        offset = 0
      }

      if (allLoaded.value) {
        return Promise.resolve()
      }

      const dataSource = ExpensesDB.instance
      const expenses = await dataSource.getList(offset, limit)

      if (expenses.length < limit) {
        allLoaded.value = true
      } else {
        offset += limit
      }

      const viewExpenses = expenses.map((expense: Expense) => formatExpense(expense))

      if (nextPage) {
        list.value.push(...viewExpenses)
      } else {
        console.log('addImportedExpenses')
        list.value = viewExpenses
      }
    } catch (error) {
      throw error
    }
  }

  const addExpense = async (value: number, code: string) => {
    try {
      const expenseDate = dayjs()
      const unixDate = expenseDate.unix()

      const expense: Expense = {
        value,
        currency: code,
        date: unixDate,
      }

      const dataSource = ExpensesDB.instance
      const id = await dataSource.add(expense)

      const viewExpense: ViewExpense = {
        id,
        value: currencyFormat(value, code, getLocale()),
        date: expenseDate.format('hh:mm'),
        unixDate: unixDate,
      }

      list.value.unshift(viewExpense)
    } catch (error) {
      throw error
    }
  }

  const removeExpense = async (id: number) => {
    try {
      const dataSource = ExpensesDB.instance
      await dataSource.delete(id)

      const expenseIndex = list.value.findIndex((expense) => expense.id === id)
      if (expenseIndex > -1) {
        list.value.splice(expenseIndex, 1)
      }
    } catch (error) {
      throw error
    }
  }

  const deleteAll = async (): Promise<void> => {
    try {
      isDeletingAllData.value = true
      const dataSource = ExpensesDB.instance
      await dataSource.deleteAllData()

      list.value = []
    } catch (error) {
      throw error
    } finally {
      isDeletingAllData.value = false
    }
  }

  const importExpenses = (expenses: ViewExpense[]) => {
    list.value.push(...expenses)
    list.value = list.value
      .filter((expense) => expense.unixDate !== null)
      .sort((a, b) => (b.unixDate as number) - (a.unixDate as number))
  }

  const getExpensesForDate = async (date: number) => {
    try {
      const dataSource = ExpensesDB.instance
      const results: ExpenseForDateType[] = await dataSource.getExpensesForDate(date)

      return results.map((result: ExpenseForDateType) =>
        currencyFormat(result.total, result.currency, getLocale()),
      )

    } catch (error) {
      throw error
    }

  }

  return {
    list,
    allLoaded,

    getExpenses,
    addExpense,
    removeExpense,
    deleteAll,

    importExpenses,

    getExpensesForDate,

    isDeletingAllData,
  }
})
