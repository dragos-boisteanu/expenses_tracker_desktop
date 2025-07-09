import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAutoUpdateStore = defineStore('autoUpdate', () => {
  const autoUpdate = ref<boolean>(false)
  const setAutoUpdate = (payload) => {
    autoUpdate.value = payload
  }

  const checkingForUpdate = ref<boolean>(false)
  const setCheckingForUpdate = (payload) => {
    checkingForUpdate.value = payload
  }

  const isUpdateDownloaded = ref(false)
  const setIsUpdateDownloaded = (payload) => {
    isUpdateDownloaded.value = payload
  }

  return {
    autoUpdate,
    setAutoUpdate,

    checkingForUpdate,
    setCheckingForUpdate,

    isUpdateDownloaded,
    setIsUpdateDownloaded,
  }
})
