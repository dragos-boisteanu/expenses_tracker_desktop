import { Expense } from '@/types/expense'
import { ImportedExpense } from '@/types/importedExpense'
import { DbImportResult } from '@/types/dbImportResult'

export interface IExpensesSource {
  getList(offset: number, limit: number): Promise<Expense[]>
  export(fileName: string): Promise<void>
  import(expenses: ImportedExpense[]): Promise<DbImportResult>
  add(expense: Expense): Promise<number>
  delete(id: number): Promise<number>
  deleteAllData(): Promise<number>
}
