<script setup lang="ts">
import { computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'
import { useToastStore } from '@/stores/toast'
import { useNotificationStore } from '@/stores/notifications'

const expensesStore = useExpensesStore()
const importStore = useImportStore()
const toastStore = useToastStore()
const exportStore = useExportStore()
const notificationStore = useNotificationStore()

const exportData = async () => {
  try {
    toastStore.add({
      text: 'Export in progress. Do not close the app !',
    })

    await exportStore.exportExpenses()

    // TODO: only show the notification if the app is not focused when the
    // export finishes
    notificationStore
      .addNotification({
        title: 'Export successfully completed',
        content: 'You expenses list was successfully exported!',
        type: 'data',
        isError: false,
        isNew: false,
      })
      .catch((error) => console.error('addNotificationError', error))

    // TODO: only show the toast if the app is focused when the
    // export finishes
    toastStore.add({
      text: 'Export successfully completed',
    })
  } catch (error) {
    toastStore.add({
      text: 'Error while exporting expenses',
    })
    console.error('error', error)
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
