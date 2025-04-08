import type { Expense } from '@/types/expense.ts'
import type { ViewExpense } from '@/types/viewExpense.ts'
import currencyFormat from '@/helpers/currencyFormat.ts'
import { useExpensesStore } from '@/stores/expenses'
import dayjs from '@/plugins/dayjs.ts'

export class ExpensesService {
  expenses: Expense[] = [
    { id: '1', value: 200.45, currency: 'RON', date: dayjs().toString() },
    { id: '2', value: 24.09, currency: 'RON', date: dayjs().toString() },
    { id: '3', value: 10.05, currency: 'RON', date: dayjs().subtract(1, 'day').toString() },
    { id: '4', value: 1000.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '5', value: 234.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '6', value: 946345.05, currency: 'RON', date: dayjs().subtract(3, 'day').toString() },
  ]

  daysToAdd: number = 1

  getExpenses() {
    //   TODO: call api or local db
    //   placeholder logic for now

    const expenseStore = useExpensesStore()

    const expenses: ViewExpense[] = this.expenses.map((expense) => {
      const expenseDate = dayjs(expense.date)

      return {
        id: expense.id,
        value: currencyFormat(expense.value),
        currency: '',
        date: expenseDate.format('DD/MM/YY HH:mm'),
      }
    })

    expenseStore.setList(expenses)
  }

  addExpense(value: number) {
    const expenseStore = useExpensesStore()
    const expenseDate = dayjs().add(this.daysToAdd, 'day')
    this.daysToAdd++
    const expense: Expense = {
      id: `${this.expenses.length + 1}`,
      value,
      date: expenseDate.toISOString(),
    }
    this.expenses.unshift(expense)

    expenseStore.add({
      id: expense.id,
      value: currencyFormat(value),
      currency: '',
      date: expenseDate.format('DD/MM/YY HH:mm'),
    })

    return expenseDate
  }

  removeExpense(id: string) {
    const expenseIndex = this.expenses.findIndex((expense) => expense.id === id)
    if (expenseIndex > -1) {
      this.expenses.splice(expenseIndex, 1)
    }
  }
}
