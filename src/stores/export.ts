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

      console.log('export 1.3')
      const expensesDb = ExpensesDB.instance

      console.log('export 1.5')
      await expensesDb.export(fileName)

      console.log('export 1.6')
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
