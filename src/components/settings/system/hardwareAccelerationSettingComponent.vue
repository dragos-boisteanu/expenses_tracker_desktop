<script setup lang="ts">
import TogglerComponent from '@/components/togglerComponent.vue'
import { ref } from 'vue'
import { useSystemStore } from '@/stores/system'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'

const systemStore = useSystemStore()
const hardwareAcceleration = ref<boolean>(false)
hardwareAcceleration.value = systemStore.isHardwareAccelerationDisabled

const setHardwareAcceleration = async (value) => {
  try {
    await window['app']?.disableHardwareAcceleration(value)
    systemStore.setIsHardwareAccelerationDisabled(value)
    toggleRestartNowDialog()
  } catch (error) {
    console.error('toggleHardwareAcceleration', error)
    hardwareAcceleration.value = false
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
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Toggle hardware acceleration
      </div>
    </div>
    <toggler-component v-model="hardwareAcceleration" @changed="setHardwareAcceleration" />
  </div>
</template>

<style scoped></style>
<!--hardwareAcceleration-->
