<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
import LocalDB from '@/repositories/LocalDB'
import { useSystemStore } from '@/stores/system'
import { NotificationService } from '@/services/notificationService'
import NotificationsDB from '@/repositories/NotificationDB'
import NewUpdateDialog from '@/components/newUpdateDialog.vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
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
const autoUpdateStore = useAutoUpdateStore()

const app = window['app']
if (app) {
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
      case 'autoUpdate': {
        autoUpdateStore.setAutoUpdate(payload.data.value)
        break
      }
      case 'updateDownloaded': {
        console.log('updateDownloaded', payload.data)
        break
      }
      case 'updateAvailable': {
        console.log('updateAvailable', payload.data)
        newUpdateDetails.value.content = payload.data.content
        newUpdateDetails.value.date = payload.data.date
        newUpdateDetails.value.version = payload.data.version
        showNewUpdateDialog.value = true

        break
      }
      case 'updateNotAvailable': {
        console.log('updateNotAvailable', payload.data)
        break
      }
      case 'isHwAccelerationDisabled': {
        systemStore.setIsHardwareAccelerationDisabled(payload.data.value)
        break
      }
      case 'launchAtSystemStartup': {
        systemStore.setLaunchAtSystemStartup(payload.data.value)
        break
      }
      case 'notification': {
        break
      }
    }
  })
}

const showNewUpdateDialog = ref(false)
const newUpdateDetails = ref({
  version: '',
  content: '',
  date: '',
})
provide('expensesService', expensesService)
</script>

<template>
  <new-update-dialog
    v-if="showNewUpdateDialog"
    :content="newUpdateDetails.version"
    :date="newUpdateDetails.date"
    :version="newUpdateDetails.version"
    @close="showNewUpdateDialog = false"
  />
  <div id="app-container" class="size-full" :class="{ dark: themeStore.theme === 'dark' }">
    <RouterView />
  </div>
</template>

<style>
@import './assets/fonts.css';
</style>
