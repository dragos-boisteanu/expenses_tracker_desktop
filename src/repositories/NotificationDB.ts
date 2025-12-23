import type { INotificationsSource } from '@/interfaces/INotificationsSource'
import type { Notification } from '@/types/notification'

export default class NotificationsDB implements INotificationsSource {
  private _db
  private static _instance

  constructor() {
    this._db = window['db']
  }

  public static get instance() {
    if (!NotificationsDB._instance) {
      NotificationsDB._instance = new NotificationsDB()
    }

    return NotificationsDB._instance
  }

  async addNotification(notification: Notification): Promise<number> {
    return await this._db.addNotification(notification)
  }

  async markNotificationAsRead(id: number) {
    return await this._db.markNotificationAsRead(id)
  }

  async markAllNotificationsAsRead() {
    return await this._db.markAllNotificationsAsRead()
  }

  async deleteNotifications() {
    return await this._db.deleteNotifications()
  }

  async deleteNotification(id: number) {
    return await this._db.deleteNotification(id)
  }

  async getNotifications(offset: number, limit: number): Promise<Notification[]> {
    return await this._db.getNotifications(offset, limit)
  }
}
