import { NotificationService } from '@/services/notificationService'
import { ToastService } from '@/services/toastService'
import { PiniaStore } from '@/types/PiniaStore'
import { IDb } from '@/interfaces/IDb'
import { useImportStore } from '@/stores/import'
import { CsvService } from '@/services/csvService'
import { useExpensesStore } from '@/stores/expenses'
import { DbImportResult } from '@/types/dbImportResult'
export default class ImportService {
  private notificationService: NotificationService
  private toastService: ToastService
  private importStore: PiniaStore<typeof useImportStore>
  private expensesStore: PiniaStore<typeof useExpensesStore>
  private repository: IDb

  constructor(
    repository: IDb,
    notificationService: NotificationService,
    toastService: ToastService,
  ) {
    this.notificationService = notificationService
    this.toastService = toastService
    this.importStore = useImportStore()
    this.expensesStore = useExpensesStore()
    this.repository = repository
  }

  async import(file: File): Promise<void> {
    try {
      //TODO: paginate data when reading from csv so
      // it won't overload the memory in case of large data
      this.importStore.setIsImporting(true)
      this.toastService.add('Import in progress. Do not close the app !')

      const csvService = new CsvService()
      const data = await csvService.import(file)

      if (data.length > 0) {
        const importResult: DbImportResult = await this.repository.import(data)
        console.log('importResult', importResult)

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

        this.notificationService
          .add(notificationTitle, notificationContent, 'data', false)
          .catch((error) => console.error('failedToSaveNotification', error))

        this.toastService.add(toast)
      }
    } catch (error) {
      console.error('getAllError', error)

      this.notificationService
        .add('Import failed !', 'Your data was not imported !', 'data')
        .catch((error) => console.error('failedToSaveNotification', error))

      this.toastService.add('Data import failed !')
    } finally {
      this.importStore.setIsImporting(false)
    }
  }
}
