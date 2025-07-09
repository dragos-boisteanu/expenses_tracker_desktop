<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { ref } from 'vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'

const props = defineProps({
  version: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
})
const emits = defineEmits(['close'])
const close = () => {
  if (isDownloading.value) {
    return
  }
  emits('close')
}

const updateStore = useAutoUpdateStore()

const isDownloading = ref(false)
const downloadUpdate = async () => {
  try {
    isDownloading.value = true
    await window['app']?.downloadUpdate()
    updateStore.setIsUpdateDownloaded(true)
    toggleConfirmRestartDialog()
  } catch (error) {
    console.error('downloadAndInstall', error)
  } finally {
    isDownloading.value = false
  }
}

const showConfirmRestartDialog = ref(false)
const toggleConfirmRestartDialog = () => {
  showConfirmRestartDialog.value = !showConfirmRestartDialog.value
  if (!showConfirmRestartDialog.value) {
    close()
  }
}

const restartApp = () => {
  window['app']?.quitAndInstall()
}
</script>

<template>
  <dialog-component @close="close">
    <template #dialog>
      <dialog-component v-if="showConfirmRestartDialog" @close="toggleConfirmRestartDialog">
        <template #title> Install update </template>
        <template #default>
          Restart the app in order for the update to be installed. Otherwise the update will be
          installed when the app will be closed
        </template>
        <template #actions>
          <cancel-button-component @click="toggleConfirmRestartDialog"
            >Cancel</cancel-button-component
          >
          <confirm-button-component @click="restartApp"> Restart </confirm-button-component>
        </template>
      </dialog-component>
    </template>
    <template #title>New update available.</template>
    <template #default>
      <div>
        <div>Version {{ props.version }}</div>
        <!--        TODO: style the change log -->
        <div v-html="props.content"></div>
      </div>
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>
      <confirm-button-component @click="downloadUpdate" :loading="isDownloading">
        Download
      </confirm-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
