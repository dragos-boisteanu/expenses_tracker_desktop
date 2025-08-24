import type { Expense } from '@/types/expense'
import currencyFormat from '@/helpers/currencyFormat'
import { useExpensesStore } from '@/stores/expenses'
import dayjs from '@/plugins/dayjs'
import getLocale from '@/helpers/getLocale'
import { ViewExpense } from '@/types/viewExpense'
import { PiniaStore } from '@/types/PiniaStore'
import { IDb } from '@/interfaces/IDb'
import { NotificationService } from '@/services/notificationService'
import { ToastService } from '@/services/toastService'
import { formatExpense } from '@/helpers/formatExpense'

export class ExpensesService {
  store: PiniaStore<typeof useExpensesStore>
  repository: IDb
  offset: number = 0
  limit: number = 15
  allLoaded: boolean = false
  notification: NotificationService
  toastService: ToastService

  constructor(repository: IDb, notification: NotificationService, toastService: ToastService) {
    this.store = useExpensesStore()
    this.repository = repository
    this.notification = notification
    this.toastService = toastService
  }

  async getExpenses(firstPage: boolean = false, nextPage: boolean = false): Promise<boolean> {
    let expenses = []
    const locale = getLocale()
    try {
      if (this.allLoaded) {
        return this.allLoaded
      }

      if (firstPage) {
        this.offset = 0
      }

      expenses = await this.repository.getList(this.offset, this.limit)

      if (expenses.length < this.limit) {
        this.allLoaded = true
      } else {
        this.offset += this.limit
      }

      expenses = expenses.map((expense: Expense) => formatExpense(expense, locale)) as ViewExpense[]

      if (nextPage) {
        this.store.addExpenses(expenses)
      } else {
        this.store.setList(expenses)
      }

      return false
    } catch (error) {
      console.error('getExpensesError', error)
    }
  }

  async addExpense(value: number, code: string) {
    const expenseDate = dayjs()
    const unixDate = expenseDate.unix()
    try {
      const expense: Expense = {
        value,
        currency: code,
        date: unixDate,
      }

      const id = await this.repository.add(expense)
      const locale = getLocale()

      const viewExpense: ViewExpense = {
        id,
        value: currencyFormat(value, code, locale),
        currency: expense.currency || '',
        date: expenseDate.format('DD/MM/YY HH:mm'),
        unixDate: unixDate,
      }

      this.store.add(viewExpense)
    } catch (error) {
      throw error
    }
  }

  async removeExpense(id: number) {
    try {
      await this.repository.delete(id)
      this.store.remove(id)
    } catch (error) {
      console.error('removeExpenseError', error)
    }
  }

  async deleteAllData() {
    try {
      this.store.setIsDeletingAllData(true)
      const deletedItemsCount = await this.repository.deleteAllData()
      this.store.deleteAllData()

      this.toastService.add('All data deleted successfully.')
      this.notification
        .add('Data removed', 'All data was successfully removed.', 'data', false)
        .catch((error) => console.error('failedToSaveNotification', error))
      return deletedItemsCount
    } catch (error) {
      console.error('deleteAllDataError', error)
      this.toastService.add('Failed to delete data.')

      this.notification
        .add('Data not removed', 'Failed to remove data', 'data', false)
        .catch((error) => console.error('failedToSaveNotification', error))
    } finally {
      this.store.setIsDeletingAllData(false)
    }
  }
}
