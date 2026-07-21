export const toDatabaseValue = (userInput: number, code: string): number => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: code,
  })

  // Find out how many decimals the currency uses
  const decimals = formatter.resolvedOptions().maximumFractionDigits
  const multiplier = Math.pow(10, decimals)

  // Multiply and round to avoid JavaScript floating point errors (e.g. 4.11 * 100 = 411.00000000000006)
  return Math.round(userInput * multiplier)
}
