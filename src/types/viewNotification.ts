export type ViewNotification = {
  id: number | bigint
  title: string
  content: string
  type: string
  isNew: boolean
  isError: boolean
  createdAt: number
}
