import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useSystemStore = defineStore('system', () => {
    const launchAtSystemStartup = ref(false);
    const setLaunchAtSystemStartup = (payload) => {
        launchAtSystemStartup.value = payload;
    };
    const isHardwareAccelerationDisabled = ref(false);
    const setIsHardwareAccelerationDisabled = (payload) => {
        isHardwareAccelerationDisabled.value = payload;
    };
    return {
        launchAtSystemStartup,
        setLaunchAtSystemStartup,
        isHardwareAccelerationDisabled,
        setIsHardwareAccelerationDisabled,
    };
});
