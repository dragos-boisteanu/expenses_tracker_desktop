import type { ToastType } from '@/types/ToastType';
export declare const useToastStore: import("pinia").StoreDefinition<"toasts", Pick<{
    list: import("vue").Ref<{
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[], ToastType[] | {
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[]>;
    add: (payload: ToastType) => void;
    remove: (id: number) => void;
}, "list">, Pick<{
    list: import("vue").Ref<{
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[], ToastType[] | {
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[]>;
    add: (payload: ToastType) => void;
    remove: (id: number) => void;
}, never>, Pick<{
    list: import("vue").Ref<{
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[], ToastType[] | {
        text: string;
        duration?: number;
        id?: number;
        path?: string;
        type?: string;
    }[]>;
    add: (payload: ToastType) => void;
    remove: (id: number) => void;
}, "add" | "remove">>;
