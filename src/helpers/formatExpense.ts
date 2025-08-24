import type { Expense } from '@/types/expense'
import { ViewExpense } from '@/types/viewExpense'
import dayjs from '@/plugins/dayjs'
import currencyFormat from '@/helpers/currencyFormat'

export const formatExpense = (expense: Expense, locale: string): ViewExpense => {
  const expenseDate = dayjs.unix(expense.date).format('DD/MM/YY HH:mm')

  return {
    id: expense.id,
    value: currencyFormat(expense.value, expense.currency, locale),
    currency: expense.currency || '',
    date: expenseDate,
    unixDate: expense.date,
  }
}
