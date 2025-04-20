import { Expense } from '@/types/expense'

export default class LocalDB {
  db

  constructor() {
    this.db = window['db']
  }

  async getList() {
    return await this.db.getList()
  }

  async add(expense: Expense) {
    return await this.db.insert(expense)
  }

  async delete(id: string) {
    await this.db.delete(id)
  }
}
