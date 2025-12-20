import type { ViewExpense } from '@/types/viewExpense';
export declare const useExpensesStore: import("pinia").StoreDefinition<"expenses", Pick<{
    list: import("vue").Ref<{
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[], ViewExpense[] | {
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[]>;
    allLoaded: import("vue").Ref<boolean, boolean>;
    getExpenses: (firstPage?: boolean, nextPage?: boolean) => Promise<void>;
    addExpense: (value: number, code: string) => Promise<void>;
    removeExpense: (id: number) => Promise<void>;
    deleteAll: () => Promise<void>;
    importExpenses: (expenses: ViewExpense[]) => void;
    isDeletingAllData: import("vue").Ref<boolean, boolean>;
}, "list" | "allLoaded" | "isDeletingAllData">, Pick<{
    list: import("vue").Ref<{
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[], ViewExpense[] | {
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[]>;
    allLoaded: import("vue").Ref<boolean, boolean>;
    getExpenses: (firstPage?: boolean, nextPage?: boolean) => Promise<void>;
    addExpense: (value: number, code: string) => Promise<void>;
    removeExpense: (id: number) => Promise<void>;
    deleteAll: () => Promise<void>;
    importExpenses: (expenses: ViewExpense[]) => void;
    isDeletingAllData: import("vue").Ref<boolean, boolean>;
}, never>, Pick<{
    list: import("vue").Ref<{
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[], ViewExpense[] | {
        id: number | null;
        value: string;
        currency?: string;
        date: string;
        unixDate: number | null;
    }[]>;
    allLoaded: import("vue").Ref<boolean, boolean>;
    getExpenses: (firstPage?: boolean, nextPage?: boolean) => Promise<void>;
    addExpense: (value: number, code: string) => Promise<void>;
    removeExpense: (id: number) => Promise<void>;
    deleteAll: () => Promise<void>;
    importExpenses: (expenses: ViewExpense[]) => void;
    isDeletingAllData: import("vue").Ref<boolean, boolean>;
}, "getExpenses" | "addExpense" | "removeExpense" | "deleteAll" | "importExpenses">>;
