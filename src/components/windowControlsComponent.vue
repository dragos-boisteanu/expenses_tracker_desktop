<script setup lang="ts">
import { XMarkIcon, MinusIcon } from '@heroicons/vue/24/outline'
import { useExpensesStore } from '@/stores/expenses'
import DialogComponent from '@/components/dialogComponent.vue'
import { ref } from 'vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'

const showConfirmAppCloseDialog = ref<boolean>(false)
const expensesStore = useExpensesStore()
const importStore = useImportStore()
const exportStore = useExportStore()

const toggleShowConfirmAppCloseDialog = () => {
  showConfirmAppCloseDialog.value = !showConfirmAppCloseDialog.value
}
const closeApp = (event, force: boolean = false) => {
  if (
    !force &&
    (exportStore.isExporting || importStore.isImporting || expensesStore.isDeletingAllData)
  ) {
    toggleShowConfirmAppCloseDialog()
  } else {
    window['app']?.close()
  }
}
const minimizeApp = () => {
  window['app']?.minimizeApp()
}
</script>

<template>
  <dialog-component @close="toggleShowConfirmAppCloseDialog" v-if="showConfirmAppCloseDialog">
    <template #title>Confirm app close ?</template>
    <template #default>
      <div>
        <div>
          <span class="font-semibold" v-if="exportStore.isExporting">Exporting data</span>
          <span class="font-semibold" v-else-if="importStore.isImporting">Importing data</span>
          <span class="font-semibold" v-else-if="expensesStore.isDeletingAllData"
            >Deleting data</span
          >
          <span> is in progress.</span>
        </div>
        <div>By closing the app right now the action might fail and data might be loss.</div>
      </div>
    </template>
    <template #actions>
      <cancel-button-component @click="toggleShowConfirmAppCloseDialog"
        >Cancel</cancel-button-component
      >
      <danger-button-component @click="closeApp($event, true)"> Close app </danger-button-component>
    </template>
  </dialog-component>
  <div class="flex items-center gap-x-4">
    <button class="drag--disabled group size-5 cursor-pointer rounded-full" @click="minimizeApp">
      <MinusIcon
        class="size-fit rounded-full text-neutral-700 group-hover:text-neutral-600 group-active:text-neutral-800 dark:text-neutral-300 group-hover:dark:text-neutral-50 group-active:dark:text-neutral-400"
      />
    </button>
    <button class="drag--disabled group size-5 cursor-pointer rounded-full" @click="closeApp">
      <XMarkIcon
        class="size-fit rounded-full text-neutral-700 group-hover:text-red-600 group-active:text-red-700 dark:text-neutral-300"
      />
    </button>
  </div>
</template>

<style scoped></style>
