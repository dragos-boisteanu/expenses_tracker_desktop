import type { Expense } from '@/types/expense'
import Papa, { Parser, ParseStepResult } from 'papaparse'

export class CsvService {
  async export(data: Expense[], header: boolean = true) {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array.')
    }

    const csvContent = Papa.unparse(data, {
      header,
    })

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
  }
}
