import type { Expense } from '@/types/expense.ts'
import dayjs from 'dayjs'

export class ExpensesService {
  expenses: Expense[] = [
    { id: '1', value: 200.45, currency: 'RON', date: dayjs().toString() },
    { id: '2', value: 24.09, currency: 'RON', date: dayjs().toString() },
    { id: '3', value: 10.05, currency: 'RON', date: dayjs().toString() },
    { id: '4', value: 1000.05, currency: 'RON', date: dayjs().toString() },
  ]

  daysToAdd: number = 1

  getExpenses(): Expense[] {
    //   TODO: call api or local db
    //   placeholder logic for now
    const yesterday = dayjs()
      .add(this.daysToAdd - 1, 'days')
      .subtract(1, 'day')
      .startOf('day')

    return this.expenses.map((expense, index, array) => {
      const expenseDate = dayjs(expense.date).startOf('day')

      let showDayLimiter = false
      let dayLimiterText = ''

      if (array[index + 1] && !expenseDate.isSame(dayjs(array[index + 1].date).startOf('day'))) {
        const previousExpenseDate = dayjs(array[index + 1].date).startOf('day')

        if (previousExpenseDate.isSame(yesterday)) {
          showDayLimiter = true
          dayLimiterText = 'Yesterday'
        } else if (previousExpenseDate.isBefore(yesterday)) {
          showDayLimiter = true
          dayLimiterText = `${previousExpenseDate.format('DD/MM/YYYY')}`
        }
      }

      return {
        id: expense.id,
        value: expense.value,
        date: expenseDate.format('DD/MM/YY HH:mm'),
        showDayLimiter,
        dayLimiterText,
      }
    })
  }

  addExpense(value: number) {
    const expenseDate = dayjs().add(this.daysToAdd, 'day')
    this.daysToAdd++
    this.expenses.unshift({
      id: `${this.expenses.length + 1}`,
      value,
      date: expenseDate.toISOString(),
    })
  }

  removeExpense(id: string) {
    const expenseIndex = this.expenses.findIndex((expense) => expense.id === id)
    if (expenseIndex > -1) {
      this.expenses.splice(expenseIndex, 1)
    }
  }
}
