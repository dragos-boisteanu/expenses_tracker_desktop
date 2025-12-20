export default class NotificationsDB {
    _db;
    static _instance;
    constructor() {
        this._db = window['db'];
    }
    static get instance() {
        if (!NotificationsDB._instance) {
            NotificationsDB._instance = new NotificationsDB();
        }
        return NotificationsDB._instance;
    }
    async addNotification(notification) {
        return await this._db.addNotification(notification);
    }
    async markNotificationAsRead(id) {
        return await this._db.markNotificationAsRead(id);
    }
    async markAllNotificationsAsRead() {
        return await this._db.markAllNotificationsAsRead();
    }
    async deleteNotifications() {
        return await this._db.deleteNotifications();
    }
    async deleteNotification(id) {
        return await this._db.deleteNotification(id);
    }
    async getNotifications(offset, limit) {
        return await this._db.getNotifications(offset, limit);
    }
}
