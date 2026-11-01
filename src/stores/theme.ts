import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>('light')

  const getThemeFromConfig = async () => {
    try {
      return await window['app']?.getTheme()
    } catch (error) {
      console.error('getTheme', error)
    }
  }

  const setTheme = (payload: string, saveToConfig: boolean = false) => {
    theme.value = payload

    if (payload === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }

    if (saveToConfig) {
      window['app']?.setTheme(payload)
    }
  }

  return {
    theme,
    setTheme,
    getThemeFromConfig,
  }
})
