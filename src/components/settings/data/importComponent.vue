<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { useExportStore } from '@/stores/export'
import { useImportStore } from '@/stores/import'

const expensesStore = useExpensesStore()
const importStore = useImportStore()
const exportStore = useExportStore()
const fileInput = ref(HTMLElement || null)

onMounted(() => {
  if (!fileInput.value) {
    return
  }

  fileInput.value.addEventListener('change', handleFileInputChange)
})

onBeforeUnmount(() => {
  if (!fileInput.value) {
    return
  }

  fileInput.value.removeEventListener('change', handleFileInputChange)
})
const importData = async () => {
  try {
    if (!fileInput.value) return

    fileInput.value.click()
  } catch (error) {
    console.error('error', error)
  }
}
const handleFileInputChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    await importStore.importExpenses(file)
    await expensesStore.getExpenses(true)
  }

  e.target.value = ''
}

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || exportStore.isExporting || importStore.isImporting
})
</script>

<template>
  <div class="flex items-center justify-between">
    <input type="file" ref="fileInput" accept=".csv" class="hidden" />

    <div>
      <div class="font-semibold">Import data</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Import expenses from local <b>csv</b>
      </div>
    </div>
    <general-button-component
      :disabled="isDisabled"
      :loading="importStore.isImporting"
      @click="importData"
    >
      Import
    </general-button-component>
  </div>
</template>

<style scoped></style>
