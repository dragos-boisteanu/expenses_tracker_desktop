import type { Expense } from '@/types/expense'
import currencyFormat from '@/helpers/currencyFormat'
import { useExpensesStore } from '@/stores/expenses'
import dayjs from '@/plugins/dayjs'
import LocalDB from '@/repositories/LocalDB'
import MemoryDB from '@/repositories/MemoryDB'
import getLocale from '@/helpers/getLocale'
import { ViewExpense } from '@/types/viewExpense'

export class ExpensesService {
  store
  repository

  constructor(repository: LocalDB | MemoryDB) {
    this.store = useExpensesStore()
    this.repository = repository
  }

  async getExpenses() {
    let expenses = []
    const locale = getLocale()
    try {
      expenses = await this.repository.getList()
      expenses = expenses.map((expense: Expense) =>
        this.formatExpense(expense, locale),
      ) as ViewExpense[]
      this.store.setList(expenses)
    } catch (error) {
      console.error('getExpensesError', error)
    }
  }

  async addExpense(value: number, code: string) {
    const expenseDate = dayjs()
    try {
      const expense: Expense = {
        id: '',
        value,
        currency: code,
        date: expenseDate.toISOString(),
      }

      const id = await this.repository.add(expense)
      const locale = getLocale()

      this.store.add({
        id,
        value: currencyFormat(value, code, locale),
        currency: expense.currency || '',
        date: expenseDate.format('DD/MM/YY HH:mm'),
      })
    } catch (error) {
      throw error
    }
  }

  async removeExpense(id: string) {
    try {
      await this.repository.delete(id)
      this.store.remove(id)
    } catch (error) {
      console.error('removeExpenseError', error)
    }
  }

  private formatExpense(expense: Expense, locale: string): ViewExpense {
    const expenseDate = dayjs(expense.date).format('DD/MM/YY HH:mm')

    return {
      id: expense.id.toString(),
      value: currencyFormat(expense.value, expense.currency, locale),
      currency: expense.currency || '',
      date: expenseDate,
    }
  }
}
