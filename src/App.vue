<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
import LocalDB from '@/repositories/LocalDB'
import { useSystemStore } from '@/stores/system'
const timeStore = useTimeStore()
const themeStore = useThemeStore()

timeStore.startTimer()
const theme = localStorage.getItem('theme')

if (theme) {
  themeStore.setTheme(theme)
}

// const expensesService = new ExpensesService(new MemoryDB())
const expensesService = new ExpensesService(new LocalDB())
provide('expenseServices', expensesService)
onMounted(() => {
  expensesService.getExpenses()
})
onBeforeUnmount(() => timeStore.stopTimer())

const app = window['app']
if (app) {
  app.getLaunchAtSystemStartup().then((value: boolean) => {
    const systemStore = useSystemStore()
    systemStore.setLaunchAtSystemStartup(value)
  })
}

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
