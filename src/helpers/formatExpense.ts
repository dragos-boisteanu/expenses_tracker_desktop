import type { Expense } from '@/types/expense'
import type { ViewExpense } from '@/types/viewExpense'
import dayjs from '@/plugins/dayjs'
import currencyFormat from '@/helpers/currencyFormat'
import getLocale from '@/helpers/getLocale'
import { JSONContent } from '@tiptap/vue-3'

export const formatExpense = (expense: Expense): ViewExpense => {
  const expenseDate = dayjs.unix(expense.date).format('HH:mm')
  const locale = getLocale()

  const viewExpense: ViewExpense = {
    id: expense.id,
    value: currencyFormat(expense.value, expense.currency, locale),
    currency: expense.currency || '',
    date: expenseDate,
    unixDate: Number(expense.date),
  }

  if (expense.description) {
    viewExpense.description = JSON.parse(expense.description) as JSONContent
  }

  return viewExpense
}
