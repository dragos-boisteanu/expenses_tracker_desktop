<script setup lang="ts">
import { onBeforeUnmount, provide } from 'vue'
import { ExpensesService } from '@/services/expensesService.ts'
import { useTimeStore } from '@/stores/time.ts'
const timeStore = useTimeStore()

timeStore.startTimer()

onBeforeUnmount(() => timeStore.stopTimer())
provide('expensesService', new ExpensesService())
</script>

<template>
  <RouterView />
</template>
