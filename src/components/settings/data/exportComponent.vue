<script setup lang="ts">
import { inject } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import LoadingIndicator from '@/components/loadingIndicator.vue'
import { useExpensesStore } from '@/stores/expenses'
const expensesService = inject('expensesService') as ExpensesService

const expensesStore = useExpensesStore()

const exportData = async () => {
  try {
    await expensesService.export()
  } catch (error) {
    console.error('error', error)
  } finally {
    expensesStore.setIsExporting(false)
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <div>
      <div class="font-semibold">Export data</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Export expenses to <span class="italic">csv</span>
      </div>
    </div>
    <button
      class="align-center group hover-bg-neutral-200 hover flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-300/50 p-2 hover:bg-neutral-300/75 active:scale-95 active:bg-neutral-300/100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600/70 dark:active:bg-neutral-600/100"
      @click="exportData"
      :class="{
        'pointer-events-none text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      <loading-indicator v-if="expensesStore.isExporting" />
      <span v-else class="group-dark:active:text-neutral-200 text-neutral-900 dark:text-neutral-200"
        >Export</span
      >
    </button>
  </div>
</template>

<style scoped></style>
