import type { Expense } from '@/types/expense'
import type { ViewExpense } from '@/types/viewExpense'
import dayjs from '@/plugins/dayjs'
import currencyFormat from '@/helpers/currencyFormat'
import getLocale from '@/helpers/getLocale'

export const formatExpense = (expense: Expense): ViewExpense => {
  const expenseDate = dayjs.unix(expense.date).format('DD/MM/YY HH:mm')
  const locale = getLocale()

  return {
    id: expense.id,
    value: currencyFormat(expense.value, expense.currency, locale),
    currency: expense.currency || '',
    date: expenseDate,
    unixDate: expense.date,
  }
}
