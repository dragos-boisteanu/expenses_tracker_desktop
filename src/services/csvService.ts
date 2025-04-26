export class CsvService {
  export<Type>(data: Type[]): Blob {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Data must be a non-empty array.')
    }

    const csvArray = []
    let csvContent = ''

    const keys = Object.keys(data[0])
    const csvRows = [keys.map(this.escapeCSVValue).join(',')]
    csvArray.push(keys)

    for (const item of data) {
      const row = keys.map((key) => this.escapeCSVValue(item[key]))
      csvRows.push(row.join(','))
    }

    csvContent = csvRows.join('\r\n')

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
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
