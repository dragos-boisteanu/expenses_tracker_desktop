<script setup lang="ts">
import { ref } from 'vue'
import { CsvService } from '@/services/csvService'
import { useExpensesStore } from '@/stores/expenses'

const expensesStore = useExpensesStore()

const fileInput = ref(null)
const importData = async () => {
  try {
    fileInput.value.click()
    fileInput.value.addEventListener('change', handleFileInputChange)
  } catch (error) {
    console.error('error', error)
  }
}
const handleFileInputChange = async (e) => {
  fileInput.value.removeEventListener('change', handleFileInputChange)
  const file = e.target.files[0]
  if (file) {
    const csvService = new CsvService()
    const data = await csvService.import(file)
    console.log('data', data)
  }
}
</script>

<template>
  <div>
    <input type="file" ref="fileInput" accept=".csv" class="hidden" />
    <button
      @click="importData"
      class="cursor-pointer"
      :class="{ 'pointer-events-none text-neutral-500': expensesStore.isExporting }"
    >
      Import data from <span class="italic">csv</span>
    </button>
  </div>
</template>

<style scoped></style>
