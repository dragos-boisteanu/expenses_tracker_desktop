import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from '@/plugins/dayjs'
import ExpensesDB from '@/repositories/ExpensesDB'

export const useExportStore = defineStore('export', () => {
  const isExporting = ref<boolean>(false)

  const exportExpenses = async () => {
    try {
      isExporting.value = true
      const fileName = `expenses_${dayjs().format('DD_MM_YYYY_hh_mm_ss')}.csv`

      const expensesDb = ExpensesDB.instance

      await expensesDb.export(fileName)

      return null
    } catch (error) {
      console.error('getAllError', error)
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportExpenses,
  }
})
