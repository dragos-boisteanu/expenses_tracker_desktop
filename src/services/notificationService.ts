import { PiniaStore } from '@/types/PiniaStore'
import { INotificationsDb } from '@/interfaces/INotificationsDb'
import { Notification } from '@/types/notification'
import { useNotificationStore } from '@/stores/notifications'
import dayjs from '@/plugins/dayjs'
import { ViewNotification } from '@/types/viewNotification'

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
        read: 0,
        isError,
        createdAt: unixDate,
      }

      const id: number = await this.repository.addNotification(notification)

      this.store.addNotification({
        id,
        title,
        content,
        type,
        isNew: true,
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
      // TODO: implement pagination
      const notifications = await this.repository.getNotifications(this.offset, this.limit)
      const viewNotifications: ViewNotification[] = notifications.map((notification) => {
        return {
          id: notification.id,
          title: notification.title,
          content: notification.content,
          type: notification.type,
          isNew: notification.read === 0,
          isError: notification.isError,
          createdAt: notification.createdAt,
          formattedCreatedAt: dayjs(notification.createdAt).format('MM/DD/YYYY HH:mm').toString(),
        }
      })
      this.store.setNotifications(viewNotifications)
    } catch (error) {
      console.error(error)
    }
  }
  async markAsRead(id: number) {
    try {
      await this.repository.markNotificationAsRead(id)
      this.store.markAsRead(id)
    } catch (error) {
      console.error(error)
    }
  }
  async markAllAsRead() {
    try {
      await this.repository.markAllNotificationsAsRead()
      this.store.markAllAsRead()
    } catch (error) {
      console.error(error)
    }
  }
}
