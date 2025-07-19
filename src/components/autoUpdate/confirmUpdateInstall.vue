<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'

const emits = defineEmits(['close'])
const close = () => emits('close')

const restartApp = () => {
  window['app']?.quitAndInstall()
}
</script>

<template>
  <dialog-component @close="close">
    <template #title> Install update </template>
    <template #default>
      Restart the app in order for the update to be installed. Otherwise the update will be
      installed when the app will be closed
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>
      <confirm-button-component @click="restartApp"> Restart now </confirm-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
