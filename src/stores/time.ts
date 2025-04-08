import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTimeStore = defineStore('time', () => {
  const now = ref<number | null>(new Date().getTime())
  const interval = ref<number | null>(0)

  const startTimer = () => {
    interval.value = setInterval(() => {
      now.value = new Date().getTime()
    }, 1000)

    // 60000
  }

  const stopTimer = () => {
    if (interval.value) {
      clearInterval(interval.value)
      now.value = null
    }
  }

  return { now, startTimer, stopTimer }
})
