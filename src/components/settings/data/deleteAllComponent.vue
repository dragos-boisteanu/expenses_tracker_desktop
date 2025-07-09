<script setup lang="ts">
import { useExpensesStore } from '@/stores/expenses'
import { ExpensesService } from '@/services/expensesService'
import { computed, inject, ref } from 'vue'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

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

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting
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
      :is-disabled="isDisabled"
      :is-loading="expensesStore.isDeletingAllData"
      @click="toggleDeleteAllDialog"
    >
      Delete All
    </general-button-component>
  </div>
</template>

<style scoped></style>
