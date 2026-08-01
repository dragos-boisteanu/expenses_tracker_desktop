import { JSONContent } from '@tiptap/vue-3'

export type ViewExpense = {
  id?: number
  value: string
  numericValue: number
  currency?: string
  description?: JSONContent
  date: string
  unixDate: number
  unixCreatedAt: number
  updatedAt?: string
  createdAt: string
}
