import { UpdateType } from '@/types/updateType';
export declare const useAutoUpdateStore: import("pinia").StoreDefinition<"autoUpdate", Pick<{
    autoUpdate: import("vue").Ref<boolean, boolean>;
    setAutoUpdate: (payload: any) => void;
    isManualCheck: import("vue").Ref<boolean, boolean>;
    setIsManualCheck: (value: boolean) => void;
    checkingForUpdate: import("vue").Ref<boolean, boolean>;
    setCheckingForUpdate: (payload: any) => void;
    isUpdateDownloaded: import("vue").Ref<boolean, boolean>;
    setIsUpdateDownloaded: (payload: any) => void;
    isUpdateAvailable: import("vue").Ref<boolean, boolean>;
    setIsUpdateAvailable: (payload: any) => void;
    update: import("vue").Ref<{
        version: string;
        content: string;
        date: string;
    }, UpdateType | {
        version: string;
        content: string;
        date: string;
    }>;
    setUpdate: (payload: UpdateType | null) => void;
}, "update" | "autoUpdate" | "isManualCheck" | "checkingForUpdate" | "isUpdateDownloaded" | "isUpdateAvailable">, Pick<{
    autoUpdate: import("vue").Ref<boolean, boolean>;
    setAutoUpdate: (payload: any) => void;
    isManualCheck: import("vue").Ref<boolean, boolean>;
    setIsManualCheck: (value: boolean) => void;
    checkingForUpdate: import("vue").Ref<boolean, boolean>;
    setCheckingForUpdate: (payload: any) => void;
    isUpdateDownloaded: import("vue").Ref<boolean, boolean>;
    setIsUpdateDownloaded: (payload: any) => void;
    isUpdateAvailable: import("vue").Ref<boolean, boolean>;
    setIsUpdateAvailable: (payload: any) => void;
    update: import("vue").Ref<{
        version: string;
        content: string;
        date: string;
    }, UpdateType | {
        version: string;
        content: string;
        date: string;
    }>;
    setUpdate: (payload: UpdateType | null) => void;
}, never>, Pick<{
    autoUpdate: import("vue").Ref<boolean, boolean>;
    setAutoUpdate: (payload: any) => void;
    isManualCheck: import("vue").Ref<boolean, boolean>;
    setIsManualCheck: (value: boolean) => void;
    checkingForUpdate: import("vue").Ref<boolean, boolean>;
    setCheckingForUpdate: (payload: any) => void;
    isUpdateDownloaded: import("vue").Ref<boolean, boolean>;
    setIsUpdateDownloaded: (payload: any) => void;
    isUpdateAvailable: import("vue").Ref<boolean, boolean>;
    setIsUpdateAvailable: (payload: any) => void;
    update: import("vue").Ref<{
        version: string;
        content: string;
        date: string;
    }, UpdateType | {
        version: string;
        content: string;
        date: string;
    }>;
    setUpdate: (payload: UpdateType | null) => void;
}, "setAutoUpdate" | "setIsManualCheck" | "setCheckingForUpdate" | "setIsUpdateDownloaded" | "setIsUpdateAvailable" | "setUpdate">>;
