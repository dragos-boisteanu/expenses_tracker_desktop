const currencyFormat = (number: number, code: string, locale: string): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    currencyDisplay: 'symbol',
  })

  return formatter.format(number)
}

export default currencyFormat
