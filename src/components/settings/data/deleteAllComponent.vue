<script setup lang="ts">
import LoadingIndicator from '@/components/loadingIndicator.vue'
import { useExpensesStore } from '@/stores/expenses'
import { ExpensesService } from '@/services/expensesService'
import { inject, ref } from 'vue'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DialogComponent from '@/components/dialogComponent.vue'

const expensesStore = useExpensesStore()
const expensesService = inject('expensesService') as ExpensesService

const deleteAll = async (): Promise<void> => {
  try {
    toggleDeleteAllDialog()
    const removedDataCount = await expensesService.deleteAllData()
    console.log(removedDataCount)
  } catch (error) {
    console.error(error)
  }
}

const showDeleteAllDialog = ref<boolean>(false)
const toggleDeleteAllDialog = () => {
  showDeleteAllDialog.value = !showDeleteAllDialog.value
}
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <dialog-component @close="toggleDeleteAllDialog" v-if="showDeleteAllDialog">
      <template #title>Delete all data</template>
      <template #default>
        You are going to delete all stored data. This action is <strong>final</strong>. Once the
        data is deleted it can't be recovered. It is recommended to <strong>export</strong> the data
        before deleting it.
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
    <button
      class="align-center group hover-bg-neutral-200 hover flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-300/50 p-2 hover:bg-neutral-300/75 active:scale-95 active:bg-neutral-300/100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600/70 dark:active:bg-neutral-600/100"
      @click="toggleDeleteAllDialog"
      :class="{
        'pointer-events-none !bg-neutral-100 !text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      <loading-indicator v-if="expensesStore.isDeletingAllData" />
      <span
        v-else
        class="group-dark:active:text-neutral-200 text-neutral-900 dark:text-neutral-200"
      >
        Delete all</span
      >
    </button>
  </div>
</template>

<style scoped></style>
