import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import type { Expense } from '@/types/expense'
import dataSourceFactory from '@/factories/dataSourceFactory'
import { formatExpense } from '@/helpers/formatExpense'
import dayjs from '@/plugins/dayjs'
import currencyFormat from '@/helpers/currencyFormat'
import getLocale from '@/helpers/getLocale'

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
      if (allLoaded.value) {
        return Promise.resolve()
      }

      if (firstPage) {
        allLoaded.value = false
        offset = 0
      }

      const dataSource = dataSourceFactory('local')
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

      const dataSource = dataSourceFactory('local')
      const id = await dataSource.add(expense)

      const viewExpense: ViewExpense = {
        id,
        value: currencyFormat(value, code, getLocale()),
        date: expenseDate.format('DD/MM/YY HH:mm'),
        unixDate: unixDate,
      }

      list.value.unshift(viewExpense)
    } catch (error) {
      throw error
    }
  }

  const removeExpense = async (id: number) => {
    try {
      const dataSource = dataSourceFactory('local')
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
      const dataSource = dataSourceFactory('local')

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
    list.value = list.value.sort((a, b) => b.unixDate - a.unixDate)
  }

  return {
    list,
    allLoaded,

    getExpenses,
    addExpense,
    removeExpense,
    deleteAll,

    importExpenses,

    isDeletingAllData,
  }
})
