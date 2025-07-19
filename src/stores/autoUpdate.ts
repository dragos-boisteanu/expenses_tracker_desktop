import { defineStore } from 'pinia'
import { ref } from 'vue'
import { UpdateType } from '@/types/updateType'

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

  const isUpdateAvailable = ref(false)
  const setIsUpdateAvailable = (payload) => {
    isUpdateAvailable.value = payload
  }

  const update = ref<UpdateType>({
    version: '',
    content: '',
    date: '',
  })
  const setUpdate = (payload: UpdateType | null) => {
    if (payload) {
      update.value = payload
    } else {
      update.value = {
        version: '',
        content: '',
        date: '',
      }
    }
  }

  return {
    autoUpdate,
    setAutoUpdate,

    checkingForUpdate,
    setCheckingForUpdate,

    isUpdateDownloaded,
    setIsUpdateDownloaded,

    isUpdateAvailable,
    setIsUpdateAvailable,

    update,
    setUpdate,
  }
})
