<script setup lang="ts">
import { inject, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import { useExpensesStore } from '@/stores/expenses'
import { ExpensesService } from '@/services/expensesService'
import LoadingIndicator from '@/components/loadingIndicator.vue'

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
</script>

<template>
  <div class="flex items-center justify-between">
    <input type="file" ref="fileInput" accept=".csv" class="hidden" />

    <div>
      <div class="font-semibold">Import data</div>
      <div class="text-neutral-500 dark:text-neutral-400">
        Import expensive from local <span class="italic">csv</span>
      </div>
    </div>
    <!--    TODO: import, export, buttons color-->
    <button
      @click="importData"
      class="hover-bg-neutral-200 flex min-w-16 cursor-pointer items-center justify-center rounded-lg bg-purple-200 p-2 hover:bg-neutral-200 active:bg-neutral-100 active:shadow-inner dark:bg-neutral-700 dark:hover:bg-neutral-600 active:dark:bg-neutral-700"
      :class="{
        'pointer-events-none text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      <loading-indicator v-if="expensesStore.isImporting" />
      <span v-else class="text-neutral-700">Import</span>
    </button>
  </div>
</template>

<style scoped></style>
