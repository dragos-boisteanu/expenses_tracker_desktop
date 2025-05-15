import { INotificationsDb } from '@/interfaces/INotificationsDb'
import { Notification } from '@/types/notification'

export default class NotificationsDB implements INotificationsDb {
  #db

  constructor() {
    this.#db = window['db']
  }

  async addNotification(notification: Notification): Promise<number> {
    return await this.#db.addNotification(notification)
  }

  async markNotificationAsRead(id: number) {
    return await this.#db.markNotificationAsRead(id)
  }

  async markAllNotificationsAsRead() {
    return await this.#db.markAllNotifcationsAsRead()
  }

  async deleteNotifications() {
    return await this.#db.deleteNotifications()
  }

  async deleteNotification(id: number) {
    return await this.#db.deleteNotification(id)
  }

  async getNotifications(): Promise<Notification[]> {
    return await this.#db.getNotifications()
  }
}
