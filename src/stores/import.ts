import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CsvService } from '@/services/csvService'
import type { DbImportResult } from '@/types/dbImportResult'
import { useToastStore } from '@/stores/toast'
import { useNotificationStore } from '@/stores/notifications'
import ExpensesDB from '@/repositories/ExpensesDB'

export const useImportStore = defineStore('importStore', () => {
  const isImporting = ref<boolean>(false)

  const importExpenses = async (file: File): Promise<void> => {
    const toastStore = useToastStore()
    const notificationStore = useNotificationStore()

    try {
      //TODO: paginate data when reading from csv so
      // it won't overload the memory in case of large data
      isImporting.value = true
      toastStore.add({ id: -1, text: 'Import in progress. Do not close the app !' })

      const csvService = new CsvService()
      const data = await csvService.import(file)

      if (data.length > 0) {
        const expensesDb = ExpensesDB.instance
        const importResult: DbImportResult = await expensesDb.import(data)

        //TODO: make clear error, duplicate, success messages

        if (importResult.errors.length > 0) {
          console.error('importErrors', importResult.errors[1])
          return
        }

        if (importResult.inserted.length === importResult.duplicates) {
          console.warn('all data is duplicated')
          return
        }

        const insertedCount = importResult.inserted.length

        let notificationTitle = 'Import successfully completed'
        let notificationContent = `${insertedCount} new entries imported`
        let toast = `${insertedCount} new entries imported`

        if (importResult.duplicates > 0 && insertedCount === 0) {
          notificationTitle = 'Nothing to import'
          notificationContent = `Found ${importResult.duplicates} duplicates and 0 new entries.`
          toast = `Found ${importResult.duplicates} duplicates. No data inserted.`
        } else if (importResult.duplicates > 0 && insertedCount > 0) {
          notificationTitle = 'Partial data import'
          notificationContent = `Found ${importResult.duplicates} duplicates and ${insertedCount} new entries. Skip import.`
          toast = `Partial data import.  ${importResult.duplicates} duplicates. ${insertedCount} entries inserted`
        }

        notificationStore
          .addNotification({
            title: notificationTitle,
            content: notificationContent,
            type: 'data',
            isNew: false,
            isError: false,
          })
          .catch((error) => console.error('failedToSaveNotification', error))

        toastStore.add({ id: -1, text: toast })
      }
    } catch (error) {
      console.error('getAllError', error)

      notificationStore
        .addNotification({
          title: 'Import failed !',
          content: 'Your data was not imported !',
          type: 'data',
          isNew: false,
          isError: false,
        })
        .catch((error) => console.error('failedToSaveNotification', error))

      toastStore.add({ id: -1, text: 'Data import failed !' })
    } finally {
      isImporting.value = false
    }
  }

  return {
    isImporting,
    importExpenses,
  }
})
