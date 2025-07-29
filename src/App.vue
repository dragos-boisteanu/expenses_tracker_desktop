<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { ExpensesService } from '@/services/expensesService'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
import LocalDB from '@/repositories/LocalDB'
import { useSystemStore } from '@/stores/system'
import { NotificationService } from '@/services/notificationService'
import NotificationsDB from '@/repositories/NotificationDB'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import ConfirmUpdateInstall from '@/components/autoUpdate/confirmUpdateInstall.vue'
import { UpdateType } from '@/types/updateType'
import ToastComponent from '@/components/toast/toastComponent.vue'
import { ToastService } from '@/services/toastService'

const timeStore = useTimeStore()
timeStore.startTimer()

const toastService = new ToastService()
const handleCloseToast = (id: number) => {
  toastService.remove(id)
}

// setTimeout(() => {
//   toastService.add('test toast')
// }, 1000)

// setTimeout(() => {
//   toastStore.add({
//     id: '1',
//     text: 'test toast 2',
//   })
// }, 2000)
// setTimeout(() => {
//   toastStore.add({
//     id: '2',
//     text: 'test toast 3',
//   })
// }, 4000)

const themeStore = useThemeStore()
const theme = localStorage.getItem('theme')
if (theme) {
  themeStore.setTheme(theme)
}

const notificationService = new NotificationService(new NotificationsDB())
provide('notificationService', notificationService)
notificationService.getNotifications()

// const expensesService = new ExpensesService(new MemoryDB())
const expensesService = new ExpensesService(new LocalDB(), notificationService, toastService)
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
        const newUpdateDetails: UpdateType = {
          version: payload.data.version,
          content: payload.data.content,
          date: payload.data.date,
        }
        autoUpdateStore.setUpdate(newUpdateDetails)
        autoUpdateStore.setIsUpdateDownloaded(true)

        showConfirmRestartDialog.value = true

        // TODO: add click event that opens the update change log
        notificationService.add(
          `New version downloaded v${payload.data.version}`,
          'The latest update has been downloaded and awaits installation.',
          'update',
          false,
        )
        break
      }
      case 'updateAvailable': {
        const newUpdateDetails: UpdateType = {
          version: payload.data.version,
          content: payload.data.content,
          date: payload.data.date,
        }

        autoUpdateStore.setIsUpdateAvailable(true)
        autoUpdateStore.setUpdate(newUpdateDetails)

        toastService.add('A new version is available.')

        // TODO: add click event that opens the update change log
        notificationService.add(
          `New version available v${payload.data.version}`,
          'A new version is available for download. Check settings.',
          'update',
          false,
        )
        break
      }
      case 'updateNotAvailable': {
        console.log('updateNotAvailable', payload.data)
        autoUpdateStore.setUpdate(null)
        autoUpdateStore.setIsUpdateAvailable(false)

        toastService.add('You already have the latest version !')

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

const showConfirmRestartDialog = ref(false)
const toggleConfirmRestartDialog = () => {
  showConfirmRestartDialog.value = !showConfirmRestartDialog.value
}
provide('expensesService', expensesService)
</script>

<template>
  <confirm-update-install v-if="showConfirmRestartDialog" @close="toggleConfirmRestartDialog" />

  <div
    id="app-container"
    class="relative size-full overflow-hidden"
    :class="{ dark: themeStore.theme === 'dark' }"
  >
    <RouterView />
    <div class="absolute bottom-5 z-40 flex w-full flex-col gap-y-3 p-4">
      <TransitionGroup name="toast">
        <toast-component
          v-for="toast in toastService.list()"
          :key="toast.id"
          :text="toast.text"
          :link="toast.path"
          :type="toast.type"
          :duration="toast.duration"
          @close="handleCloseToast(toast.id)"
        />
      </TransitionGroup>
      <!--      <toast-component-->
      <!--        type="error"-->
      <!--        text="test toast ajdas dnals ndaslk ndasln daklsn dandlasnd ajslnd asl dasn d"-->
      <!--      />-->
      <!--      <toast-component-->
      <!--        type="success"-->
      <!--        text="test toast ajdas dnals ndaslk ndasln daklsn dandlasnd ajslnd asl dasn d"-->
      <!--      />-->
      <!--      <toast-component-->
      <!--        type="warning"-->
      <!--        text="test toast ajdas dnals ndaslk ndasln daklsn dandlasnd ajslnd asl dasn d"-->
      <!--      />-->
      <!--      <toast-component-->
      <!--        text="test toast ajdas dnals ndaslk ndasln daklsn dandlasnd ajslnd asl dasn d"-->
      <!--      />-->
    </div>
  </div>
</template>

<style>
@import './assets/fonts.css';
/* ENTER */
.toast-enter-from {
  transform: translateY(150%);
}
.toast-enter-to {
  transform: translateY(0);
}
.toast-enter-active {
  transition: transform 0.5s ease-in-out;
}

/* LEAVE */
.toast-leave-from {
  transform: translateY(0);
}
.toast-leave-to {
  transform: translateY(150%);
}
.toast-leave-active {
  transition: transform 0.5s ease-in-out;
}

.toast-move {
  transition: transform 0.5s ease-in-out;
}
</style>
