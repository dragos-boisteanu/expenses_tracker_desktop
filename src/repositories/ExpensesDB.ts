import { Expense } from '@/types/expense'
import { IExpensesSource } from '@/interfaces/IExpensesSource'
import { ImportedExpense } from '@/types/importedExpense'

export default class ExpensesDB implements IExpensesSource {
  private db
  private static _instance

  constructor() {
    this.db = window['db']
  }

  public static get instance(): ExpensesDB {
    if (!ExpensesDB._instance) {
      ExpensesDB._instance = new ExpensesDB()
    }

    return ExpensesDB._instance()
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
