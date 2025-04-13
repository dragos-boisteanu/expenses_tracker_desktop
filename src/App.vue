<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
const timeStore = useTimeStore()
const themeStore = useThemeStore()

timeStore.startTimer()
const theme = localStorage.getItem('theme')

if (theme) {
  themeStore.setTheme(theme)
}

const expensesService = new ExpensesService()
onMounted(() => {
  expensesService.getExpenses()
})
onBeforeUnmount(() => timeStore.stopTimer())

provide('expensesService', expensesService)
</script>

<template>
  <div id="app-container" class="size-full" :class="{ dark: themeStore.theme === 'dark' }">
    <RouterView />
  </div>
</template>

<style>
@import './assets/fonts.css';
</style>
