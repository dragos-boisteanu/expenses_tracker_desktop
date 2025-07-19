<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { ref } from 'vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import ConfirmUpdateInstall from '@/components/autoUpdate/confirmUpdateInstall.vue'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

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
</script>

<template>
  <dialog-component @close="close">
    <template #dialog>
      <confirm-update-install v-if="showConfirmRestartDialog" @close="toggleConfirmRestartDialog" />
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
      <general-button-component @click="downloadUpdate" :loading="isDownloading">
        Download
      </general-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
