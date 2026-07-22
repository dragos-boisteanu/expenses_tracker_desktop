import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<string>('light')

  const setTheme = (payload: string) => {
    theme.value = payload
    localStorage.setItem('theme', payload)

    console.log(payload)
    if (payload === 'dark') {
      document.body.classList.add('dark')
    } else {
      document.body.classList.remove('dark')
    }
  }

  return {
    theme,
    setTheme,
  }
})
