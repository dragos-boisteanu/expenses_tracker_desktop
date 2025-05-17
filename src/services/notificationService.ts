import { PiniaStore } from '@/types/PiniaStore'
import { INotificationsDb } from '@/interfaces/INotificationsDb'
import { Notification } from '@/types/notification'
import { useNotificationStore } from '@/stores/notifications'
import dayjs from '@/plugins/dayjs'

export class NotificationService {
  store: PiniaStore<typeof useNotificationStore>
  repository: INotificationsDb
  offset: number = 0
  limit: number = 15
  allLoaded: boolean = false

  constructor(repository: INotificationsDb) {
    this.store = useNotificationStore()
    this.repository = repository
  }

  async add(title: string, content: string, type: string, isError: boolean = false) {
    try {
      const notificationDate = dayjs()
      const unixDate = notificationDate.unix()

      const notification: Notification = {
        title,
        content,
        type,
        read: false,
        isError,
        createdAt: unixDate,
      }

      const id: number = await this.repository.addNotification(notification)

      this.store.addNotification({
        id,
        title,
        content,
        type,
        read: false,
        isError,
        createdAt: unixDate,
        formattedCreatedAt: notificationDate.format('DD/MM/YY HH:mm').toString(),
      })
    } catch (error) {
      console.error(error)
    }
  }

  async getNotifications(): Promise<void> {
    try {
      const notifications = await this.repository.getNotifications(this.offset, this.limit)
      console.log('notifications', notifications)
    } catch (error) {
      console.error(error)
    }
  }
  async markAsRead(id: number) {
    try {
    } catch (error) {}
  }
}
