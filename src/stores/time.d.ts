export declare const useTimeStore: import("pinia").StoreDefinition<"time", Pick<{
    now: import("vue").Ref<number, number>;
    startTimer: () => void;
    stopTimer: () => void;
}, "now">, Pick<{
    now: import("vue").Ref<number, number>;
    startTimer: () => void;
    stopTimer: () => void;
}, never>, Pick<{
    now: import("vue").Ref<number, number>;
    startTimer: () => void;
    stopTimer: () => void;
}, "startTimer" | "stopTimer">>;
