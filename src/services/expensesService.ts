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
  offset: number = 0
  limit: number = 15
  allLoaded: boolean = false

  constructor(repository: LocalDB | MemoryDB) {
    this.store = useExpensesStore()
    this.repository = repository
  }

  async getExpenses(nextPage: boolean = false) {
    let expenses = []
    const locale = getLocale()
    try {
      if (this.allLoaded) {
        return
      }

      expenses = await this.repository.getList(this.offset, this.limit)

      if (expenses.length < this.limit) {
        this.allLoaded = true
      } else {
        this.offset += this.limit
      }

      expenses = expenses.map((expense: Expense) =>
        this.formatExpense(expense, locale),
      ) as ViewExpense[]

      if (nextPage) {
        this.store.addExpenses(expenses)
      } else {
        this.store.setList(expenses)
      }
    } catch (error) {
      console.error('getExpensesError', error)
    }
  }

  async export() {
    try {
      const fileName = `expenses_${dayjs().format('DD_MM_YYYY_hh_mm')}.csv`
      return await this.repository.export(fileName)
    } catch (error) {
      console.error('getAllError', error)
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
