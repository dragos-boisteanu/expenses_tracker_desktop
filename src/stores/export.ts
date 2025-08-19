import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useExportStore = defineStore('export', () => {
  const isExporting = ref<boolean>(false)
  const setIsExporting = (value: boolean) => {
    isExporting.value = value
  }

  return {
    isExporting,
    setIsExporting,
  }
})
