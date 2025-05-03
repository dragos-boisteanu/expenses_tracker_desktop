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
  <div class="flex items-center gap-x-2">
    <input type="file" ref="fileInput" accept=".csv" class="hidden" />
    <button
      @click="importData"
      class="cursor-pointer hover:text-neutral-600 active:text-neutral-900 hover:dark:text-neutral-100 active:dark:text-neutral-400"
      :class="{
        'pointer-events-none text-neutral-500':
          expensesStore.isDeletingAllData || expensesStore.isExporting || expensesStore.isImporting,
      }"
    >
      Import data from <span class="italic">csv</span>
    </button>
    <loading-indicator v-if="expensesStore.isImporting" />
  </div>
</template>

<style scoped></style>
