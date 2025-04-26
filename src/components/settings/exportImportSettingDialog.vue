<script setup lang="ts">
import { inject } from 'vue'
import { ExpensesService } from '@/services/expensesService'

const expensesService = inject('expensesService') as ExpensesService

// TODO: add loading indicator
const exportData = async () => {
  try {
    await expensesService.export()
  } catch (error) {
    console.error('error', error)
  }
}
</script>

<template>
  <div>
    <button @click="exportData">Export data to <span class="italic">csv</span></button>
  </div>
</template>

<style scoped></style>
