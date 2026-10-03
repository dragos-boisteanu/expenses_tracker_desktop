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
    updateStore.setIsManualCheck(true)
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
      <div class="font-semibold">
        <span v-if="updateStore.isUpdateDownloaded">Install update</span>
        <span v-else>Check for updates</span>
      </div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        <span v-if="updateStore.isUpdateDownloaded"
          >Updates downloaded and ready to be installed</span
        >
        <span v-else> Check and download new updates</span>
      </div>
    </div>
    <general-button-component
      v-if="updateStore.isUpdateDownloaded"
      @click="toggleConfirmRestartDialog"
    >
      Install
    </general-button-component>
    <general-button-component
      v-else-if="updateStore.isUpdateAvailable"
      :loading="isDownloadingUpdate"
      @click="downloadUpdate"
    >
      Download
    </general-button-component>
    <general-button-component v-else :loading="checkingForUpdate" @click="checkForUpdate">
      Update
    </general-button-component>
  </div>
</template>

<style scoped></style>
