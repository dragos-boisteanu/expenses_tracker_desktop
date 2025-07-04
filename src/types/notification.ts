export type Notification = {
  id?: number | bigint
  title: string
  content: string
  type: string
  read: number
  isError: boolean
  createdAt: number
}
