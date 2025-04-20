import { Expense } from '@/types/expense'
import dayjs from '@/plugins/dayjs'

export default class MemoryDB {
  list: Expense[] = [
    { id: '1', value: 200.45, currency: 'RON', date: dayjs().toString() },
    { id: '2', value: 24.09, currency: 'RON', date: dayjs().toString() },
    { id: '3', value: 10.05, currency: 'RON', date: dayjs().subtract(1, 'day').toString() },
    { id: '4', value: 1000.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '5', value: 234.05, currency: 'RON', date: dayjs().subtract(2, 'day').toString() },
    { id: '6', value: 946345.05, currency: 'RON', date: dayjs().subtract(3, 'day').toString() },
  ]
  daysToAdd: number = 1

  getList() {
    return new Promise((resolve) => {
      resolve(this.list)
    })
  }

  add(expense: Expense) {
    return new Promise((resolve) => {
      this.daysToAdd++

      expense.id = `${this.list.length + 1}`

      this.list.unshift(expense)

      resolve(expense.id)
    })
  }

  delete(id: string) {
    return new Promise((resolve, reject) => {
      const expenseIndex = this.list.findIndex((expense) => expense.id === id)
      if (expenseIndex > -1) {
        const deletedItems = this.list.splice(expenseIndex, 1)

        resolve(deletedItems.length)
      }
      reject()
    })
  }
}
