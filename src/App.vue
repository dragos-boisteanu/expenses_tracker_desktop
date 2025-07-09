<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
import LocalDB from '@/repositories/LocalDB'
import { useSystemStore } from '@/stores/system'
import { NotificationService } from '@/services/notificationService'
import NotificationsDB from '@/repositories/NotificationDB'
const timeStore = useTimeStore()
const themeStore = useThemeStore()

timeStore.startTimer()
const theme = localStorage.getItem('theme')

if (theme) {
  themeStore.setTheme(theme)
}

const notificationService = new NotificationService(new NotificationsDB())
provide('notificationService', notificationService)

notificationService.getNotifications()

// const expensesService = new ExpensesService(new MemoryDB())
const expensesService = new ExpensesService(new LocalDB(), notificationService)
provide('expenseServices', expensesService)
onMounted(() => {
  expensesService.getExpenses()
})
onBeforeUnmount(() => timeStore.stopTimer())
const systemStore = useSystemStore()
const app = window['app']
if (app) {
  app.getLaunchAtSystemStartup().then((value: boolean) => {
    systemStore.setLaunchAtSystemStartup(value)
  })

  app.disableHardwareAcceleration().then((result) => {
    console.log('disableHardwareAcceleration', result)
    systemStore.setIsHardwareAccelerationDisabled(!!result)
  })
  app.mainMessage((payload) => {
    switch (payload.action) {
      case 'log': {
        switch (payload.type) {
          case 'log':
            console.log(payload.data)
            break
          case 'error':
            console.error(payload.data)
            break
          case 'info':
            console.info(payload.data)
            break
        }
        break
      }
      case 'notification': {
        break
      }
    }
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
