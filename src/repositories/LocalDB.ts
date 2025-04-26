import { Expense } from '@/types/expense'

export default class LocalDB {
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

  async add(expense: Expense) {
    return await this.db.insert(expense)
  }

  async delete(id: string) {
    await this.db.delete(id)
  }
}
