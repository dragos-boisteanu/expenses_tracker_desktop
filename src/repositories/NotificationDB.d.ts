import { INotificationsSource } from '@/interfaces/INotificationsSource';
import { Notification } from '@/types/notification';
export default class NotificationsDB implements INotificationsSource {
    private _db;
    private static _instance;
    constructor();
    static get instance(): any;
    addNotification(notification: Notification): Promise<number>;
    markNotificationAsRead(id: number): Promise<any>;
    markAllNotificationsAsRead(): Promise<any>;
    deleteNotifications(): Promise<any>;
    deleteNotification(id: number): Promise<any>;
    getNotifications(offset: number, limit: number): Promise<Notification[]>;
}
