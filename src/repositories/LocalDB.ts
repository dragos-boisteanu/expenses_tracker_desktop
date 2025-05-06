import { Expense } from '@/types/expense'
import { IDb } from '@/interfaces/IDb'
import { ImportedExpense } from '@/types/importedExpense'

export default class LocalDB implements IDb {
  db

  constructor() {
    this.db = window['db']
  }

  async getList(offset: number, limit: number): Promise<Expense[]> {
    return await this.db.getList(offset, limit)
  }

  async export(fileName: string) {
    return await this.db.exportExpenses(fileName)
  }

  async import(expenses: ImportedExpense[]) {
    return await this.db.importExpenses(expenses)
  }

  async add(expense: Expense) {
    return await this.db.insert(expense)
  }

  async delete(id: number) {
    return await this.db.delete(id)
  }

  async deleteAllData() {
    return await this.db.deleteAllData()
  }
}
