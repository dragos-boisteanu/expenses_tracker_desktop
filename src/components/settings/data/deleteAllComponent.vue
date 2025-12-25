<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'
import { computed, ref } from 'vue'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'
import { useToastStore } from '@/stores/toast'
import { useNotificationStore } from '@/stores/notifications'

const expensesStore = useExpensesStore()
const importStore = useImportStore()
const exportStore = useExportStore()

const notificationStore = useNotificationStore()
const toastStore = useToastStore()

const deleteAll = async (): Promise<void> => {
  try {
    toggleDeleteAllDialog()
    await expensesStore.deleteAll()

    toastStore.add({
      id: -1,
      text: 'All data deleted successfully.',
    })
    notificationStore
      .addNotification({
        title: 'Data removed',
        content: 'All data was successfully removed',
        type: 'data',
        isNew: false,
        isError: false,
      })
      .catch((error) => console.error('failedToSaveNotification', error))
  } catch (error) {
    console.error(error)
    toastStore.add({
      id: -1,
      text: 'Failed to delete data.',
    })

    notificationStore
      .addNotification({
        title: 'Data not removed',
        content: 'Failed to remove data',
        type: 'data',
        isNew: false,
        isError: false,
      })
      .catch((error) => console.error('failedToSaveNotification', error))
  }
}

const showDeleteAllDialog = ref<boolean>(false)
const toggleDeleteAllDialog = () => {
  showDeleteAllDialog.value = !showDeleteAllDialog.value
}

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || exportStore.isExporting || importStore.isImporting
})
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <dialog-component @close="toggleDeleteAllDialog" v-if="showDeleteAllDialog">
      <template #title>Delete all data</template>
      <template #default>
        <div>
          You are going to delete all stored data. This action is <strong>final</strong>. Once the
          data is deleted it can't be recovered. It is recommended to <strong>export</strong> the
          data before deleting it.
        </div>
      </template>
      <template #actions>
        <cancel-button-component @click="toggleDeleteAllDialog">Cancel</cancel-button-component>
        <danger-button-component @click="deleteAll"> Delete </danger-button-component>
      </template>
    </dialog-component>

    <div>
      <div class="font-semibold">Delete data</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Delete all app local stored data
      </div>
    </div>
    <general-button-component
      :disabled="isDisabled"
      :loading="expensesStore.isDeletingAllData"
      @click="toggleDeleteAllDialog"
    >
      Delete All
    </general-button-component>
  </div>
</template>

<style scoped></style>
