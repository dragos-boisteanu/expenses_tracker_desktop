import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>('light')

  const setTheme = (payload: string) => {
    theme.value = payload
  }

  return {
    theme,
    setTheme,
  }
})
