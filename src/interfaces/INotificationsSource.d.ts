import type { Notification } from '@/types/notification';
export interface INotificationsSource {
    getNotifications(offset: number, limit: number): Promise<Notification[]>;
    addNotification(notification: Notification): Promise<number>;
    markNotificationAsRead(id: number): Promise<void>;
    markAllNotificationsAsRead(): Promise<void>;
    deleteNotifications(): Promise<void>;
    deleteNotification(id: number): Promise<void>;
}
