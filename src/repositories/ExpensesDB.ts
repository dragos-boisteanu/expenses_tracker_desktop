import type { Expense } from '@/types/expense'
import type { IExpensesSource } from '@/interfaces/IExpensesSource'
import type { ImportedExpense } from '@/types/importedExpense'
import { InsertExpenseResultType } from '@/types/InserExpenseResultType'
import { UpdateExpenseResult } from '@/types/UpdateExpenseResult'

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

    return ExpensesDB._instance
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

  async add(expense: Expense): Promise<InsertExpenseResultType> {
    return await this.db.insert(expense)
  }

  async delete(id: number) {
    return await this.db.delete(id)
  }

  async deleteAllData() {
    return await this.db.deleteAllData()
  }

  async getExpensesForDate(date: number) {
    return await this.db.getExpensesForDate(date)
  }

  async updateExpenseDescription(
    id: number,
    description: string,
  ): Promise<UpdateExpenseResult | undefined> {
    return await this.db.updateExpenseDescription(id, description)
  }

  async updateExpenseValue(
    id: number,
    value: number,
    currency: string,
  ): Promise<UpdateExpenseResult | undefined> {
    return await this.db.updateExpenseValue(id, value, currency)
  }

  async updateDate(id: number, date: number): Promise<UpdateExpenseResult | undefined> {
    return await this.db.updateExpenseDate(id, date)
  }
}
