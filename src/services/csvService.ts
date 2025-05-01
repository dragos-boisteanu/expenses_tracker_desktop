import { Expense } from '@/types/expense'

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

  import(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target.result as string
        const rows = content.split('\n')
        const headers = this.deserializeRow(rows.shift(), this.delimiter).map((header) =>
          header.trim(),
        )
        const result = rows.map((row) => {
          const values = this.deserializeRow(row, this.delimiter)
          return headers.reduce((obj, key, index) => {
            obj[key] = values[index]
            return obj
          }, {})
        })

        resolve(result)
      }
      reader.onerror = (event) => {
        reject(event)
      }
      reader.readAsText(file)
    })
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
