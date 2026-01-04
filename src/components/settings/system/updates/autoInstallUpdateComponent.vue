<script setup lang="ts">
import TogglerComponent from '@/components/togglerComponent.vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import { ref } from 'vue'

const autoRestart = ref<boolean>(false)
const autoUpdateStore = useAutoUpdateStore()

autoRestart.value = autoUpdateStore.autoRestart

const setAutoRestart = (payload) => {
  autoUpdateStore.setAutoRestart(payload)

  window['app']
    ?.setAutoRestart(payload)
    .then(() => console.log('autoRestartSet'))
    .catch((error) => console.error('failedToSetAutoRestart', error))
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <div class="font-semibold">Auto restart</div>
      <div class="max-w-52 text-xs text-neutral-500 dark:text-neutral-400">
        Automatically restart and install new updates after download
      </div>
    </div>
    <toggler-component v-model="autoRestart" @changed="setAutoRestart" />
  </div>
</template>

<style scoped></style>
