const currencyFormat = (dbValue: number, code: string, locale: string): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    currencyDisplay: 'symbol',
  })

  // 1. Find out how many decimals this currency uses (e.g., USD = 2, JPY = 0, KWD = 3)
  const decimals = formatter.resolvedOptions().maximumFractionDigits

  // 2. Calculate the correct divisor (10^2 = 100, 10^0 = 1, 10^3 = 1000)
  const divisor = Math.pow(10, decimals)

  // 3. Divide the database integer by the correct divisor
  return formatter.format(dbValue / divisor)
}

export default currencyFormat
