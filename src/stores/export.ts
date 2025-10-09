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

      return await expensesDb.export(fileName)
    } catch (error) {
      console.error('getAllError', error)

      // this.notificationService
      //   .add('Export failed !', 'You expenses list was not exported!', 'error', false)
      //   .catch((error) => console.error('failedToSaveNotification', error))
      //
      // this.toastService.add('Export failed')
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,

    exportExpenses,
  }
})
