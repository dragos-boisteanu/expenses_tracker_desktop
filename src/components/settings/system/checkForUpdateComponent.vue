<script setup lang="ts">
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { ref } from 'vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import ConfirmUpdateInstall from '@/components/autoUpdate/confirmUpdateInstall.vue'

const updateStore = useAutoUpdateStore()

const checkingForUpdate = ref<boolean>(false)
const checkForUpdate = async () => {
  try {
    checkingForUpdate.value = true
    await window['app'].checkForUpdate()
  } catch (error) {
    console.error('checkForUpdate', error)
  } finally {
    checkingForUpdate.value = false
  }
}

const showConfirmRestartDialog = ref(false)
const toggleConfirmRestartDialog = () => {
  showConfirmRestartDialog.value = !showConfirmRestartDialog.value
}

const isDownloadingUpdate = ref(false)
const downloadUpdate = async () => {
  try {
    isDownloadingUpdate.value = true
    await window['app'].downloadUpdate()
  } catch (error) {
    console.error('checkForUpdate', error)
  } finally {
    isDownloadingUpdate.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <confirm-update-install v-if="showConfirmRestartDialog" @close="toggleConfirmRestartDialog" />
    <div>
      <div class="font-semibold">Check for updates</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Check and download new updates
      </div>
    </div>
    <general-button-component
      v-if="updateStore.isUpdateDownloaded"
      @click="toggleConfirmRestartDialog"
    >
      Install update
    </general-button-component>
    <general-button-component
      v-else-if="updateStore.isUpdateAvailable"
      :loading="isDownloadingUpdate"
      @click="downloadUpdate"
    >
      Download update
    </general-button-component>
    <general-button-component v-else :is-loading="checkingForUpdate" @click="checkForUpdate">
      Check for update
    </general-button-component>
  </div>
</template>

<style scoped></style>
