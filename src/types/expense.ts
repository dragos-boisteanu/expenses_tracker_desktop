export type Expense = {
  id: string
  value: number
  currency?: null | string
  date: string
  dayLimiterText?: string
  showDayLimiter?: boolean
}
