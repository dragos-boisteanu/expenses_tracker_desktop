<script setup lang="ts">
import { computed, inject } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useExpensesStore } from '@/stores/expenses'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
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

const isDisabled = computed(() => {
  return expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting
})
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <div>
      <div class="font-semibold">Export data</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Export expenses to <b>csv</b>
      </div>
    </div>
    <general-button-component
      :is-disabled="isDisabled"
      :is-loading="expensesStore.isExporting"
      @click="exportData"
    >
      Export
    </general-button-component>
  </div>
</template>

<style scoped></style>
