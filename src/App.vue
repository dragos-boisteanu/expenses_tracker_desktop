<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide } from 'vue'
import { ExpensesService } from '@/services/expensesService.ts'
import { useTimeStore } from '@/stores/time.ts'
import { useThemeStore } from '@/stores/theme.ts'
const timeStore = useTimeStore()
const themeStore = useThemeStore()

timeStore.startTimer()

onBeforeUnmount(() => timeStore.stopTimer())

const expensesService = new ExpensesService()
onMounted(() => {
  expensesService.getExpenses()
})

provide('expensesService', expensesService)
</script>

<template>
  <div class="size-full" :class="{ dark: themeStore.theme === 'dark' }">
    <RouterView />
  </div>
</template>
