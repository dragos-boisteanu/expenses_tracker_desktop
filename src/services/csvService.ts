import { Expense } from '@/types/expense'
import { ImportedExpense } from '@/types/importedExpense'
import { CsvImportResult } from '@/types/csvImportResult'

export class CsvService {
  delimiter: string = ','

  export(data: Expense[]): Blob {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array.')
    }

    const csvArray = []
    let csvContent = ''

    const keys = Object.keys(data[0])
    const csvRows = [keys.map(this.escapeCSVValue).join(this.delimiter)]
    csvArray.push(keys)

    for (const item of data) {
      const row = keys.map((key) => this.escapeCSVValue(item[key]))
      csvRows.push(row.join(this.delimiter))
    }

    csvContent = csvRows.join('\r\n')

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
  }

  import(file: File): Promise<CsvImportResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result as string

        const rows = content.split('\n')
        const headers = this.deserializeRow(rows.shift(), this.delimiter).map((header) =>
          header.trim(),
        )

        if (!this.validateCSV(headers, ['value', 'currency', 'date'])) {
          reject('Invalid CSV format: headers do not match expected format.')
        }

        const imported: ImportedExpense[] = []
        const errors: { row: string; reason: string }[] = []

        for (const [index, row] of rows.entries()) {
          const values = this.deserializeRow(row, this.delimiter)

          if (values.length != headers.length) {
            errors.push({ row, reason: `Incorrect number of columns at row ${index + 2}` })
          }

          const obj = headers.reduce((acc, key, i) => {
            acc[key] = values[i]
            return acc
          }, {})

          const expense: ImportedExpense = {
            value: Number(obj.value),
            currency: obj.currency || null,
            date: obj.date,
          }

          imported.push(expense)
        }

        resolve({
          imported,
          errors,
          total: rows.length,
          successful: imported.length,
          failed: errors.length,
        })
      }
      reader.onerror = (event) => {
        reject(event)
      }
      reader.readAsText(file)
    })
  }

  validateCSV(headers: string[], expectedHeaders: string[]): boolean {
    return expectedHeaders.every((header) => headers.includes(header))
  }

  deserializeRow(row, delimiter = ',') {
    const values = []
    let index = 0,
      matchStart = 0,
      isInsideQuotations = false
    while (true) {
      if (index === row.length) {
        values.push(row.slice(matchStart, index))
        break
      }
      const char = row[index]
      if (char === delimiter && !isInsideQuotations) {
        values.push(
          row
            .slice(matchStart, index)
            .replace(/^"|"$/g, '')
            .replace(/""/g, '"')
            .replace(/\\n/g, '\n'),
        )
        matchStart = index + 1
      }
      if (char === '"')
        if (row[index + 1] === '"') index += 1
        else isInsideQuotations = !isInsideQuotations
      index += 1
    }
    return values
  }

  escapeCSVValue = (value): string => {
    if (value === null || value === undefined) return ''
    let str = String(value)
    // Escape quotes by doubling them
    if (str.includes('"')) {
      str = str.replace(/"/g, '""')
    }
    // If value contains comma, quote, or new line, wrap it in quotes
    if (/[",\n\r]/.test(str)) {
      str = `"${str}"`
    }
    return str
  }
}
