import type { Expense } from '@/types/expense'
import currencyFormat from '@/helpers/currencyFormat'
import { useExpensesStore } from '@/stores/expenses'
import dayjs from '@/plugins/dayjs'
import getLocale from '@/helpers/getLocale'
import { ViewExpense } from '@/types/viewExpense'
import { PiniaStore } from '@/types/PiniaStore'
import { IDb } from '@/interfaces/IDb'
import { CsvService } from '@/services/csvService'
import { DbImportResult } from '@/types/dbImportResult'
import { ImportedExpense } from '@/types/importedExpense'
import { NotificationService } from '@/services/notificationService'

export class ExpensesService {
  store: PiniaStore<typeof useExpensesStore>
  repository: IDb
  offset: number = 0
  limit: number = 15
  allLoaded: boolean = false
  notification: NotificationService

  constructor(repository: IDb, notification: NotificationService) {
    this.store = useExpensesStore()
    this.repository = repository
    this.notification = notification
  }

  async getExpenses(nextPage: boolean = false): Promise<boolean> {
    let expenses = []
    const locale = getLocale()
    try {
      if (this.allLoaded) {
        return this.allLoaded
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

      return false
    } catch (error) {
      console.error('getExpensesError', error)
    }
  }

  async export() {
    try {
      this.store.setIsExporting(true)
      const fileName = `expenses_${dayjs().format('DD_MM_YYYY_hh_mm')}.csv`
      const exportResult = await this.repository.export(fileName)

      await this.notification.add(
        'Export successfully completed',
        'You expenses list was successfully exported!',
        'data',
      )

      return exportResult
    } catch (error) {
      console.error('getAllError', error)
    } finally {
      this.store.setIsExporting(false)
    }
  }
  async import(file: File) {
    try {
      this.store.setIsImporting(true)

      const csvService = new CsvService()
      const data = await csvService.import(file)

      if (data.length > 0) {
        const importResult: DbImportResult = await this.repository.import(data)
        const locale = getLocale()
        const importedExpenses: ViewExpense[] = importResult.inserted.map(
          (expense: ImportedExpense) => this.formatExpense(expense, locale),
        )
        this.store.importExpenses(importedExpenses)
      } else {
        throw new Error('Import error')
      }
    } catch (error) {
      console.error('getAllError', error)
    } finally {
      this.store.setIsImporting(false)
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

      return deletedItemsCount
    } catch (error) {
      console.error('deleteAllDataError', error)
    } finally {
      this.store.setIsDeletingAllData(false)
    }
  }

  private formatExpense(expense: Expense, locale: string): ViewExpense {
    const expenseDate = dayjs.unix(expense.date).format('DD/MM/YY HH:mm')

    return {
      id: expense.id,
      value: currencyFormat(expense.value, expense.currency, locale),
      currency: expense.currency || '',
      date: expenseDate,
      unixDate: expense.date,
    }
  }
}
