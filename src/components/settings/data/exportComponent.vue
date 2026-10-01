<script setup lang="ts">
import { computed } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'
import { useToastStore } from '@/stores/toast'
import { useNotificationStore } from '@/stores/notifications'
import sleep from '@/helpers/sleep'

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

    const appBridge = window['app']

    const isAppFocused = await appBridge.getIsFocused()
    const title = 'Export successfully completed'

    if (isAppFocused) {
      toastStore.add({
        text: title,
      })
    } else {
      notificationStore
        .addNotification({
          title,
          content: 'You expenses list was successfully exported!',
          type: 'data',
          isError: false,
          isNew: false,
        })
        .catch((error) => console.error('addNotificationError', error))
    }
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
