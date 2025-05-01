import { Expense } from '@/types/expense'

export interface IDb {
  getList(offset: number, limit: number): Promise<Expense[]>
  export(fileName: string): Promise<void>
  add(expense: Expense): Promise<number>
  delete(id: string): Promise<number>
  deleteAllData(): Promise<number>
}
