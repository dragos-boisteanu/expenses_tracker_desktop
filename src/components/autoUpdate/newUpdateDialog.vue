<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { ref } from 'vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import ConfirmUpdateInstall from '@/components/autoUpdate/confirmUpdateInstall.vue'

const props = defineProps({
  version: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
})
const emits = defineEmits(['close'])
const close = () => {
  emits('close')
}

const updateStore = useAutoUpdateStore()

const downloadUpdate = async () => {
  try {
    close()
    await window['app']?.downloadUpdate()
    updateStore.setIsUpdateDownloaded(true)
    toggleConfirmRestartDialog()
    //   TODO: show notification and add the a notification to db
    //   if an update was downloaded
  } catch (error) {
    console.error('downloadAndInstall', error)
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
    <template #title>New update available</template>
    <template #default>
      <div>
        <div>Version {{ props.version }}</div>
        <!--        TODO: style the change log -->
        <div v-html="props.content"></div>
      </div>
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>
      <confirm-button-component @click="downloadUpdate"> Download </confirm-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
