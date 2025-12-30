import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DbImportResult } from '@/types/dbImportResult'
import { useToastStore } from '@/stores/toast'
import { useNotificationStore } from '@/stores/notifications'
import ExpensesDB from '@/repositories/ExpensesDB'
import Papa, { Parser, ParseStepResult } from 'papaparse'

export const useImportStore = defineStore('importStore', () => {
  const isImporting = ref<boolean>(false)

  const importExpenses = async (file: File): Promise<void> => {
    return new Promise(resolve => {
      const toastStore = useToastStore()
      const notificationStore = useNotificationStore()

        //TODO: paginate data when reading from csv so
        // it won't overload the memory in case of large data
        isImporting.value = true
        toastStore.add({ id: -1, text: 'Import in progress. Do not close the app !' })


        const expensesDb = ExpensesDB.instance
        let insertedCount = 0
        let duplicatedCount = 0
        // let errors: any[] =  []

        // @ts-ignore
        Papa.parse(file, {
          header: true,
          chunkSize: Papa.LocalChunkSize,
          chunk: async (results: ParseStepResult<any>, parser: Parser) => {
            try {
              parser.pause()
              const importResult: DbImportResult = await expensesDb.import(results.data)
              if (importResult.errors.length > 0) {
                console.error('importErrors', importResult.errors[1])
                return
              }

              duplicatedCount += importResult.duplicates
              insertedCount += importResult.inserted
              // errors.push(...importResult.errors)
            } catch (e) {
              console.error(e)
            } finally {
              parser.resume()
            }
          },
          complete: (results: ParseStepResult<any>, file: File) => {
            /* console.log('parsedComplete')
             console.log('insertedCount', insertedCount)
             console.log('duplicatedCount', duplicatedCount)*/

            let notificationTitle = 'Import successfully completed'
            let notificationContent = `${insertedCount} new entries imported`
            let toast = `${insertedCount} new entries imported`


            //  TODO: handle errors
            /* if(errors.length > 0) {
               notificationTitle = 'Import failed'
               notificationContent = 'Errors prevent importing data'

             } else */

            if (insertedCount === duplicatedCount || duplicatedCount > 0 && insertedCount === 0) {
              notificationTitle = 'All entries already exists'
              notificationContent = `${duplicatedCount} duplicates. Nothing to import.`
              toast = notificationContent
            } else if (duplicatedCount > 0 && insertedCount > 0) {
              notificationTitle = 'Partial data import'
              notificationContent = `Found ${duplicatedCount} duplicates and ${insertedCount} new entries.`
              toast = `Partial data import. ${duplicatedCount} duplicates. ${insertedCount} entries added`
            } else {
                notificationTitle = 'New data added'
                notificationContent = `${insertedCount} new entries imported.`
                toast = `${insertedCount} entries imported`
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

            toastStore.add({ text: toast })

            resolve()

            isImporting.value = false
            }
            })
      })
    }


  return {
    isImporting,
    importExpenses,
  }
})
