import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSystemStore = defineStore('system', () => {
  const launchAtSystemStartup = ref<boolean>(false)
  const setLaunchAtSystemStartup = (payload) => {
    launchAtSystemStartup.value = payload
  }

  const isHardwareAccelerationEnabled = ref<boolean>(false)
  const setIsHardwareAccelerationEnabled = (payload) => {
    isHardwareAccelerationEnabled.value = payload
  }

  return {
    launchAtSystemStartup,
    setLaunchAtSystemStartup,

    isHardwareAccelerationEnabled,
    setIsHardwareAccelerationEnabled,
  }
})
