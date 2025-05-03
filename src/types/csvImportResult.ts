import { ImportedExpense } from '@/types/importedExpense'

export type CsvImportResult = {
  imported: ImportedExpense[]
  errors: { row: string; reason: string }[]
  total: number
  successful: number
  failed: number
}
