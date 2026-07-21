import { JSONContent } from '@tiptap/vue-3'

export type ViewExpense = {
  id?: number
  value: string
  currency?: string
  description?: JSONContent
  date: string
  unixDate: number
  updatedAt?: number
}
