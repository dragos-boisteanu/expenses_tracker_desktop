<script setup lang="ts">
import TogglerComponent from '@/components/togglerComponent.vue'
import { ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'

const systemStore = useSystemStore()
const isHardwareAccelerationEnabled = ref<boolean>(false)
isHardwareAccelerationEnabled.value = systemStore.isHardwareAccelerationEnabled

const setHardwareAcceleration = async (value) => {
  try {
    console.log('setHardwareAcceleration', value)
    await window['app']?.setHardwareAcceleration(value)
    systemStore.setIsHardwareAccelerationEnabled(value)
    toggleRestartNowDialog()
  } catch (error) {
    console.error('toggleHardwareAcceleration', error)
    isHardwareAccelerationEnabled.value = false
  }
}

const showRestartNowDialog = ref<boolean>(false)
const toggleRestartNowDialog = () => {
  showRestartNowDialog.value = !showRestartNowDialog.value
}

const restartNow = () => {
  try {
    window['app']?.restartNow()
  } catch (error) {
    console.error('restartNow', error)
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <dialog-component @close="toggleRestartNowDialog" v-if="showRestartNowDialog">
      <template #title>Restart now ?</template>
      <template #default>
        <div>
          In order to <strong>disable</strong> or <strong>enable</strong> hardware acceleration the
          app needs to be restarted.
        </div>
      </template>
      <template #actions>
        <cancel-button-component @click="toggleRestartNowDialog">Cancel</cancel-button-component>
        <confirm-button-component @click="restartNow"> Restart </confirm-button-component>
      </template>
    </dialog-component>
    <div>
      <div class="font-semibold">Hardware acceleration</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">Toggle hardware acceleration</div>
    </div>
    <toggler-component v-model="isHardwareAccelerationEnabled" @changed="setHardwareAcceleration" />
  </div>
</template>

<style scoped></style>
<!--hardwareAcceleration-->
