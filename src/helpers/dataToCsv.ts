import type { Expense } from '@/types/expense'
import Papa from 'papaparse'

export const dataToCsv = async (data: Expense[], header: boolean = true): Promise<Blob> => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array.')
    }

    const csvContent = Papa.unparse(data, {
      header,
    })

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
  }
