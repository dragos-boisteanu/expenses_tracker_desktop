import { type ComputedRef } from 'vue';
import type { ViewNotification } from '@/types/viewNotification';
import type { AddNotificationType } from '@/types/addNotificationType';
export declare const useNotificationStore: import("pinia").StoreDefinition<"notifications", Pick<{
    list: import("vue").Ref<{
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[], ViewNotification[] | {
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[]>;
    count: ComputedRef<number>;
    newCount: ComputedRef<string | number>;
    addNotification: (payload: AddNotificationType) => Promise<void>;
    getNotifications: (nextPage?: boolean) => Promise<boolean>;
    markAsRead: (id: number) => Promise<void>;
    markUnread: (id: number) => void;
    markAllAsRead: () => Promise<void>;
}, "list">, Pick<{
    list: import("vue").Ref<{
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[], ViewNotification[] | {
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[]>;
    count: ComputedRef<number>;
    newCount: ComputedRef<string | number>;
    addNotification: (payload: AddNotificationType) => Promise<void>;
    getNotifications: (nextPage?: boolean) => Promise<boolean>;
    markAsRead: (id: number) => Promise<void>;
    markUnread: (id: number) => void;
    markAllAsRead: () => Promise<void>;
}, "count" | "newCount">, Pick<{
    list: import("vue").Ref<{
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[], ViewNotification[] | {
        id: number | bigint;
        title: string;
        content: string;
        type: string;
        isNew: boolean;
        isError: boolean;
        createdAt: number;
        formattedCreatedAt: string;
    }[]>;
    count: ComputedRef<number>;
    newCount: ComputedRef<string | number>;
    addNotification: (payload: AddNotificationType) => Promise<void>;
    getNotifications: (nextPage?: boolean) => Promise<boolean>;
    markAsRead: (id: number) => Promise<void>;
    markUnread: (id: number) => void;
    markAllAsRead: () => Promise<void>;
}, "addNotification" | "getNotifications" | "markAsRead" | "markUnread" | "markAllAsRead">>;
