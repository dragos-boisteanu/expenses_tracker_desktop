import type { Expense } from '@/types/expense'
import type { ViewExpense } from '@/types/viewExpense'
import dayjs from '@/plugins/dayjs'
import formatValue from '@/helpers/formatValue'
import { JSONContent } from '@tiptap/vue-3'

export const formatExpense = (expense: Expense): ViewExpense => {
  const expenseDate = dayjs.unix(expense.date)
  const formattedExpenseData = expenseDate.format('HH:mm')

  let createdAt: string = ''
  let updatedAt: string = ''

  if (expense.date === expense.created_at) {
    createdAt = expenseDate.format('DD/MM/YYYY HH:mm')
  } else {
    createdAt = dayjs.unix(expense.created_at).format('DD/MM/YYYY HH:mm')
  }

  if (expense.updated_at) {
    updatedAt = dayjs.unix(expense.updated_at).format('DD/MM/YYYY HH:mm')
  }

  const viewExpense: ViewExpense = {
    id: expense.id,
    value: formatValue(expense.value, expense.currency),
    numericValue: expense.value / 100,
    currency: expense.currency || '',
    date: formattedExpenseData,
    unixDate: expense.date,
    unixCreatedAt: expense.created_at,
    createdAt,
    updatedAt,
  }

  if (expense.description) {
    viewExpense.description = JSON.parse(expense.description) as JSONContent
  }

  return viewExpense
}
