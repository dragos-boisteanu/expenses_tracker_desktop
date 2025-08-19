<script setup lang="ts">
import { computed, inject } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { ExportService } from '@/services/exportService'
import { useExportStore } from '@/stores/export'

const exportService = inject('exportService') as ExportService

const expensesStore = useExpensesStore()
const exportStore = useExportStore()

const exportData = async () => {
  try {
    await exportService.export()
  } catch (error) {
    console.error('error', error)
  } finally {
    expensesStore.setIsExporting(false)
  }
}

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || exportStore.isExporting || expensesStore.isImporting
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
