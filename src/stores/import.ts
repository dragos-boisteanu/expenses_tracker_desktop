import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useImportStore = defineStore('importStore', () => {
  const isImporting = ref<boolean>(false)
  const setIsImporting = (payload: boolean) => {
    isImporting.value = payload
  }

  return {
    isImporting,
    setIsImporting,
  }
})
