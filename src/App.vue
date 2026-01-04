<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useTimeStore } from '@/stores/time'
import { useThemeStore } from '@/stores/theme'
import { useSystemStore } from '@/stores/system'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import ConfirmUpdateInstall from '@/components/autoUpdate/confirmUpdateInstall.vue'
import type { UpdateType } from '@/types/updateType'
import { useExpensesStore } from '@/stores/expenses'
import { useNotificationStore } from '@/stores/notifications'
import { useToastStore } from '@/stores/toast'
import ToastContainerComponent from '@/components/toast/toastContainerComponent.vue'

const timeStore = useTimeStore()
timeStore.startTimer()

const toastStore = useToastStore()

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

const notificationStore = useNotificationStore()
notificationStore.getNotifications().catch((error) => console.error('GetNotifications', error))

onMounted(() => {
  const expensesStore = useExpensesStore()
  expensesStore.getExpenses().catch((error) => {
    console.error('getExpensesError', error)
  })
})

onBeforeUnmount(() => timeStore.stopTimer())

const systemStore = useSystemStore()
const autoUpdateStore = useAutoUpdateStore()

const app = window['app']
if (app) {
  app.requestHardwareAccelerationValue().then((response: boolean) => {
    systemStore.setIsHardwareAccelerationEnabled(response)
  })

  app.requestLaunchAtSystemStartupValue().then((response: boolean) => {
    systemStore.setLaunchAtSystemStartup(response)
  })

  app.requestAutoRestartValue().then((response: boolean) => {
    autoUpdateStore.setAutoRestart(response)
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

        // TODO: add click event that opens the update change log
        notificationStore.addNotification({
          title: `New version downloaded v${payload.data.version}`,
          content: 'The latest update has been downloaded and awaits installation.',
          type: 'data',
          isNew: true,
          isError: false,
        })

        if (!payload.data.autoRestart) {
          showConfirmRestartDialog.value = true
        }

        break
      }
      case 'updateAvailable': {
        console.log('updateAvailable', payload)
        const newUpdateDetails: UpdateType = {
          version: payload.data.version,
          content: payload.data.content,
          date: payload.data.date,
        }

        autoUpdateStore.setIsUpdateAvailable(true)
        autoUpdateStore.setUpdate(newUpdateDetails)

        if (autoUpdateStore.isManualCheck) {
          toastStore.add({ text: 'A new version is available.' })
        }

        // TODO: add click event that opens the update change log
        notificationStore.addNotification({
          title: `New version available v${payload.data.version}`,
          content: 'A new version is available for download. Check settings.',
          type: 'data',
          isNew: true,
          isError: false,
        })

        // TODO: show a dialog that display the change log and option to
        // Download ( ignore auto restart)
        // Download && Install (app restart)

        break
      }
      case 'updateNotAvailable': {
        console.log('updateNotAvailable', payload.data)
        autoUpdateStore.setUpdate(null)
        autoUpdateStore.setIsUpdateAvailable(false)

        if (autoUpdateStore.isManualCheck) {
          toastStore.add({ text: 'You already have the latest version !' })
          autoUpdateStore.setIsManualCheck(false)
        }

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
      <toast-container-component />

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
</style>
