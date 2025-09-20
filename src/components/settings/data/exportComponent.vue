<script setup lang="ts">
import { computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { ExportService } from '@/services/exportService'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'
import { useToastStore } from '@/stores/toast'

const expensesStore = useExpensesStore()
const exportStore = useExportStore()
const importStore = useImportStore()

const exportData = async () => {
  const exportService = new ExportService()
  const toastStore = useToastStore()

  try {
    exportStore.setIsExporting(true)
    toastStore.add({
      text: 'Export in progress. Do not close the app !',
    })

    await exportService.export()

    toastStore.add({
      text: 'Export successfully completed',
    })
  } catch (error) {
    toastStore.add({
      text: 'Error while exporting expenses',
    })
    console.error('error', error)
  } finally {
    exportStore.setIsExporting(false)
  }
}

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || exportStore.isExporting || importStore.isImporting
})
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <div>
      <div class="font-semibold">Export data</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Export expenses to <b>csv</b>
      </div>
    </div>
    <general-button-component
      :disabled="isDisabled"
      :loading="exportStore.isExporting"
      @click="exportData"
    >
      Export
    </general-button-component>
  </div>
</template>

<style scoped></style>
