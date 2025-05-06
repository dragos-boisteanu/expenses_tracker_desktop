import { Expense } from '@/types/expense'

export type DbImportResult = {
  inserted: Expense[] | []
  errors: any[]
  duplicates: number
}
