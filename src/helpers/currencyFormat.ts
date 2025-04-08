const currencyFormat = (number: number): string => {
  const [intPart, decimalPart = '00'] = number.toFixed(2).split('.')

  const withThousandSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return `${withThousandSeparator},${decimalPart}`
}

export default currencyFormat
