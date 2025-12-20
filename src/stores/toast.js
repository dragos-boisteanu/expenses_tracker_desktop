import { defineStore } from 'pinia';
import { ref } from 'vue';
const MAX_TOASTS = 2;
const DEFAULT_DURATION = 3000;
export const useToastStore = defineStore('toasts', () => {
    const list = ref([]);
    const add = (payload) => {
        payload.id = list.value.length + 1;
        payload.duration = DEFAULT_DURATION;
        if (list.value.length < MAX_TOASTS) {
            list.value.unshift(payload);
        }
        else {
            list.value.splice(list.value.length - 1, 1);
            list.value.unshift(payload);
        }
    };
    const remove = (id) => {
        const index = list.value.findIndex((entry) => entry.id === id);
        if (index > -1) {
            list.value.splice(index, 1);
        }
    };
    return {
        list,
        add,
        remove,
    };
});
