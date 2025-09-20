import { NotificationService } from '@/services/notificationService'
import { ToastService } from '@/services/toastService'
import { useExportStore } from '@/stores/export'
import { PiniaStore } from '@/types/PiniaStore'
import dayjs from '@/plugins/dayjs'
import { IExpensesSource } from '@/interfaces/IExpensesSource'

export class ExportService {
  // notificationService: NotificationService
  // toastService: ToastService
  // store: PiniaStore<typeof useExportStore>
  // repository: IExpensesSource

  constructor() {}

  export = async () => {
    try {
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
