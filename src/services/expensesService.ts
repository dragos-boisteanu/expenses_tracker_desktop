import type { Expense } from '@/types/expense'
import type { ViewExpense } from '@/types/viewExpense'
import currencyFormat from '@/helpers/currencyFormat'
import { useExpensesStore } from '@/stores/expenses'
import dayjs from '@/plugins/dayjs'

export class ExpensesService {
  expenses: Expense[] = [
    { id: '1', value: 200.45, currency: 'RON', date: dayjs().toString() },
    { id: '2', value: 24.09, currency: 'RON', date: dayjs().toString() },
    { id: '3', value: 10.05, currency: 'RON', date: dayjs().subtract(1, 'day').toString() },
    { id: '4', value: 1000.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '5', value: 234.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '6', value: 946345.05, currency: 'RON', date: dayjs().subtract(3, 'day').toString() },
  ]

  store

  daysToAdd: number = 1

  constructor() {
    this.store = useExpensesStore()
  }

  getExpenses() {
    //   TODO: call api or local db
    //   placeholder logic for now

    const expenses: ViewExpense[] = this.expenses.map((expense) => {
      const expenseDate = dayjs(expense.date)

      return {
        id: expense.id,
        value: currencyFormat(expense.value),
        currency: expense.currency || '',
        date: expenseDate.format('DD/MM/YY HH:mm'),
      }
    })

    this.store.setList(expenses)
  }

  addExpense(value: number) {
    const expenseDate = dayjs().add(this.daysToAdd, 'day')
    this.daysToAdd++
    const expense: Expense = {
      id: `${this.expenses.length + 1}`,
      value,
      currency: 'RON',
      date: expenseDate.toISOString(),
    }
    this.expenses.unshift(expense)

    this.store.add({
      id: expense.id,
      value: currencyFormat(value),
      currency: expense.currency || '',
      date: expenseDate.format('DD/MM/YY HH:mm'),
    })

    return expenseDate
  }

  removeExpense(id: string) {
    const expenseIndex = this.expenses.findIndex((expense) => expense.id === id)
    if (expenseIndex > -1) {
      this.expenses.splice(expenseIndex, 1)

      this.store.remove(id)
    }
  }
}
