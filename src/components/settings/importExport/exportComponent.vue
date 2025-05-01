<script setup lang="ts">
import { inject } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import LoadingIndicator from '@/components/loadingIndicator.vue'
import { useExpensesStore } from '@/stores/expenses'
const expensesService = inject('expensesService') as ExpensesService

const expensesStore = useExpensesStore()

const deleteData = async () => {
  try {
    expensesStore.setIsExporting(true)
    await expensesService.deleteAllData()
  } catch (error) {
    console.error('error', error)
  } finally {
    expensesStore.setIsExporting(false)
  }
}
</script>

<template>
  <div class="flex items-center gap-x-2">
    <button
      class="cursor-pointer hover:text-neutral-600 active:text-neutral-900 hover:dark:text-neutral-100 active:dark:text-neutral-400"
      @click="deleteData"
      :class="{ 'pointer-events-none text-neutral-500': expensesStore.isExporting }"
    >
      Export data to <span class="italic">csv</span>
    </button>

    <loading-indicator v-if="expensesStore.isExporting" />
  </div>
</template>

<style scoped></style>
