import { ref } from 'vue';
import { defineStore } from 'pinia';
export const useThemeStore = defineStore('theme', () => {
    const theme = ref('light');
    const setTheme = (payload) => {
        theme.value = payload;
        localStorage.setItem('theme', payload);
    };
    return {
        theme,
        setTheme,
    };
});
