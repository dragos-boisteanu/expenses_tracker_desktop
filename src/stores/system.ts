import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const launchAtSystemStartup = ref<boolean>(false)
  const disableHardwareAcceleration = ref<boolean>(false)

  const setLaunchAtSystemStartup = (payload) => {
    launchAtSystemStartup.value = payload
  }
  const setDisableHardwareAcceleration = (payload) => {
    disableHardwareAcceleration.value = payload
  }

  return {
    launchAtSystemStartup,
    setLaunchAtSystemStartup,

    disableHardwareAcceleration,
    setDisableHardwareAcceleration,
  }
})
