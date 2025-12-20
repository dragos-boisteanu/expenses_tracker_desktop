import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useTimeStore = defineStore('time', () => {
    const now = ref(new Date().getTime());
    const interval = ref(0);
    const startTimer = () => {
        interval.value = window.setInterval(() => {
            now.value = new Date().getTime();
        }, 60000);
        // 60000
    };
    const stopTimer = () => {
        if (interval.value) {
            clearInterval(interval.value);
            now.value = null;
        }
    };
    return { now, startTimer, stopTimer };
});
