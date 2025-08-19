import { NotificationService } from '@/services/notificationService'
import { ToastService } from '@/services/toastService'
import { useExportStore } from '@/stores/export'
import { PiniaStore } from '@/types/PiniaStore'
import dayjs from '@/plugins/dayjs'
import { IDb } from '@/interfaces/IDb'

export class ExportService {
  notificationService: NotificationService
  toastService: ToastService
  store: PiniaStore<typeof useExportStore>
  repository: IDb

  constructor(
    repository: IDb,
    notificationService: NotificationService,
    toastService: ToastService,
  ) {
    this.notificationService = notificationService
    this.toastService = toastService
    this.store = useExportStore()
    this.repository = repository
  }

  export = async () => {
    try {
      this.store.setIsExporting(true)
      this.toastService.add('Export in progress. Do not close the app !')
      const fileName = `expenses_${dayjs().format('DD_MM_YYYY_hh_mm_ss')}.csv`

      const exportResult = await this.repository.export(fileName)

      this.notificationService
        .add(
          'Export successfully completed',
          'You expenses list was successfully exported!',
          'data',
          false,
        )
        .catch((error) => console.error('failedToSaveNotification', error))

      this.toastService.add('Export successfully completed')
      return exportResult
    } catch (error) {
      console.error('getAllError', error)

      this.notificationService
        .add('Export failed !', 'You expenses list was not exported!', 'error', false)
        .catch((error) => console.error('failedToSaveNotification', error))

      this.toastService.add('Export failed')
    } finally {
      this.store.setIsExporting(false)
    }
  }
}
