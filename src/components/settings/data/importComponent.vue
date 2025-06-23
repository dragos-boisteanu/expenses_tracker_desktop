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
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Import expenses from local <span class="italic">csv</span>
      </div>
    </div>
    <!--    TODO: import, export, buttons color-->
    <button
      @click="importData"
      class="align-center group hover-bg-neutral-200 hover flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-300/50 p-2 hover:bg-neutral-300/75 active:scale-95 active:bg-neutral-300/100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600/70 dark:active:bg-neutral-600/100"
      :class="{
        'pointer-events-none text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      <loading-indicator v-if="expensesStore.isImporting" />
      <span v-else class="group-dark:active:text-neutral-200 text-neutral-900 dark:text-neutral-200"
        >Import</span
      >
    </button>
  </div>
</template>

<style scoped></style>
