<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import { ExpensesService } from '@/services/expensesService'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

const expensesStore = useExpensesStore()
const expenseService = inject('expensesService') as ExpensesService
const fileInput = ref(null)

onMounted(() => {
  fileInput.value.addEventListener('change', handleFileInputChange)
})

onBeforeUnmount(() => {
  fileInput.value.removeEventListener('change', handleFileInputChange)
})
const importData = async () => {
  try {
    fileInput.value.click()
  } catch (error) {
    console.error('error', error)
  }
}
const handleFileInputChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    await expenseService.import(file)
  }

  e.target.value = ''
}

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting
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
      :is-disabled="isDisabled"
      :is-loading="expensesStore.isImporting"
      @click="importData"
    >
      Import
    </general-button-component>
  </div>
</template>

<style scoped></style>
