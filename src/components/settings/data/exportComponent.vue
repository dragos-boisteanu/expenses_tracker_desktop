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
      <div class="text-neutral-500 dark:text-neutral-400">
        Export expensive to <span class="italic">csv</span>
      </div>
    </div>
    <button
      class="align-center hover-bg-neutral-200 flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-100 p-2 hover:bg-neutral-200 active:bg-neutral-100 active:shadow-inner dark:bg-neutral-700 dark:hover:bg-neutral-600 active:dark:bg-neutral-700"
      @click="exportData"
      :class="{
        'pointer-events-none text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      <loading-indicator v-if="expensesStore.isExporting" />
      <span v-else class="text-neutral-700">Export</span>
    </button>
  </div>
</template>

<style scoped></style>
