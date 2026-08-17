import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import type { Expense } from '@/types/expense'
import { formatExpense } from '@/helpers/formatExpense'
import dayjs from '@/plugins/dayjs'
import formatValue from '@/helpers/formatValue'
import ExpensesDB from '@/repositories/ExpensesDB'
import { ExpenseForDateType } from '@/types/ExpenseForDateType'
import { JSONContent } from '@tiptap/vue-3'
import { toDatabaseValue } from '@/helpers/toDatabaseValue'
import { InsertExpenseResultType } from '@/types/InserExpenseResultType'

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
        list.value = viewExpenses
      }
    } catch (error) {
      throw error
    }
  }

  const addExpense = async (value: number, code: string, description?: JSONContent) => {
    try {
      const expenseDate = dayjs()
      const unixDate = expenseDate.unix()
      const formatedValue = toDatabaseValue(value, code)

      const expense: Expense = {
        value: formatedValue,
        currency: code,
        date: unixDate,
      }

      if (description) {
        expense.description = JSON.stringify(description)
      }

      const dataSource = ExpensesDB.instance

      const response: InsertExpenseResultType = await dataSource.add(expense)

      const viewExpense: ViewExpense = formatExpense({
        ...expense,
        id: response.id,
        created_at: response.created_at,
      })

      list.value.unshift(viewExpense)
    } catch (error) {
      throw error
    }
  }

  const updateExpenseDescription = async (id: number, description: JSONContent) => {
    try {
      const expenseIndex = list.value.findIndex((expense) => expense.id === id)
      if (expenseIndex === -1) {
        return
      }

      const dataSource = ExpensesDB.instance

      const updatedAtDayJs = dayjs()
      const updatedAt = updatedAtDayJs.unix()
      await dataSource.updateExpenseDescription(id, JSON.stringify(description), updatedAt)

      list.value[expenseIndex].description = description
      list.value[expenseIndex].updatedAt = updatedAtDayJs.format('DD/MM/YYYY HH:mm')
    } catch (e) {
      throw e
    }
  }

  const updateExpenseValue = async (id: number, value: number, currency: string) => {
    try {
      const expenseIndex = list.value.findIndex((expense) => expense.id === id)
      if (expenseIndex === -1) {
        return
      }

      const dataSource = ExpensesDB.instance

      const databaseValue = toDatabaseValue(value, currency)

      const updatedAtDayJs = dayjs()
      const updatedAt = updatedAtDayJs.unix()
      await dataSource.updateExpenseValue(id, databaseValue, currency, updatedAt)

      list.value[expenseIndex].numericValue = value
      list.value[expenseIndex].value = formatValue(databaseValue, currency)
      list.value[expenseIndex].updatedAt = updatedAtDayJs.format('DD/MM/YYYY HH:mm')
      list.value[expenseIndex].currency = currency
    } catch (e) {
      throw e
    }
  }

  const updateExpenseDate = async (id: number, date: number) => {
    try {
      const expenseIndex = list.value.findIndex((expense) => expense.id === id)
      if (expenseIndex === -1) {
        return
      }

      const dataSource = ExpensesDB.instance

      const response = await dataSource.updateDate(id, date)

      list.value[expenseIndex].unixDate = date
      list.value[expenseIndex].date = dayjs.unix(date).format('HH:mm')

      let updatedAt = ''
      if (response) {
        updatedAt = dayjs.unix(response).format('DD/MM/YYYY HH:mm')
      } else {
        updatedAt = dayjs().format('DD/MM/YYYY HH:mm')
      }
      list.value[expenseIndex].updatedAt = updatedAt

      list.value = list.value.sort((a, b) => b.unixDate - a.unixDate)
    } catch (e) {
      throw e
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
      .sort((a, b) => b.unixDate - a.unixDate)
  }

  const getExpensesForDate = async (date: number) => {
    try {
      const dataSource = ExpensesDB.instance
      const results: ExpenseForDateType[] = await dataSource.getExpensesForDate(date)

      return results.map((result: ExpenseForDateType) => formatValue(result.total, result.currency))
    } catch (error) {
      throw error
    }
  }

  return {
    list,
    allLoaded,

    getExpenses,
    addExpense,
    updateExpenseDescription,
    updateExpenseValue,
    updateExpenseDate,

    removeExpense,
    deleteAll,

    importExpenses,

    getExpensesForDate,

    isDeletingAllData,
  }
})
