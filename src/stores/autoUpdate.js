import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useAutoUpdateStore = defineStore('autoUpdate', () => {
    const autoUpdate = ref(false);
    const setAutoUpdate = (payload) => {
        autoUpdate.value = payload;
    };
    const isManualCheck = ref(false);
    const setIsManualCheck = (value) => {
        isManualCheck.value = value;
    };
    const checkingForUpdate = ref(false);
    const setCheckingForUpdate = (payload) => {
        checkingForUpdate.value = payload;
    };
    const isUpdateDownloaded = ref(false);
    const setIsUpdateDownloaded = (payload) => {
        isUpdateDownloaded.value = payload;
    };
    const isUpdateAvailable = ref(false);
    const setIsUpdateAvailable = (payload) => {
        isUpdateAvailable.value = payload;
    };
    const update = ref({
        version: '',
        content: '',
        date: '',
    });
    const setUpdate = (payload) => {
        if (payload) {
            update.value = payload;
        }
        else {
            update.value = {
                version: '',
                content: '',
                date: '',
            };
        }
    };
    return {
        autoUpdate,
        setAutoUpdate,
        isManualCheck,
        setIsManualCheck,
        checkingForUpdate,
        setCheckingForUpdate,
        isUpdateDownloaded,
        setIsUpdateDownloaded,
        isUpdateAvailable,
        setIsUpdateAvailable,
        update,
        setUpdate,
    };
});
