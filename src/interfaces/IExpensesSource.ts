import type { Expense } from '@/types/expense'
import type { ImportedExpense } from '@/types/importedExpense'
import type { DbImportResult } from '@/types/dbImportResult'
import { InsertExpenseResultType } from '@/types/InserExpenseResultType'

export interface IExpensesSource {
  getList(offset: number, limit: number): Promise<Expense[]>
  export(fileName: string): Promise<void>
  import(expenses: ImportedExpense[]): Promise<DbImportResult>
  add(expense: Expense): Promise<InsertExpenseResultType>
  delete(id: number): Promise<number>
  deleteAllData(): Promise<number>
}
