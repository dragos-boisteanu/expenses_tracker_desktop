import type { Expense } from '@/types/expense.ts'
import dayjs from 'dayjs'

export class ExpensesService {
  expenses: Expense[] = [
    { id: '1', value: 200.45, currency: 'RON', date: new Date().toString() },
    { id: '2', value: 24.09, currency: 'RON', date: new Date().toString() },
    { id: '3', value: 10.05, currency: 'RON', date: new Date().toString() },
    { id: '4', value: 1000.05, currency: 'RON', date: new Date().toString() },
  ]

  getExpenses(): Expense[] {
    //   TODO: call api or local db
    //   placeholder logic for now

    return this.expenses
      .sort((a, b) => new Date(b.date).getMilliseconds() - new Date(a.date).getMilliseconds())
      .map((expense) => {
        return {
          id: expense.id,
          value: expense.value,
          date: dayjs(expense.date).format('DD/MM/YY HH:mm'),
        }
      })
  }

  addExpense(value: number) {
    this.expenses.unshift({
      id: this.expenses.length.toString(),
      value,
      date: dayjs().add(1, 'day').toString(),
    })
  }

  removeExpense(id: string) {
    const expenseIndex = this.expenses.findIndex((expense) => expense.id === id)
    if (expenseIndex > -1) {
      this.expenses.splice(expenseIndex, 1)
    }
  }
}
