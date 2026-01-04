<script setup lang="ts">
import TogglerComponent from '@/components/togglerComponent.vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import { ref } from 'vue'

const autoUpdate = ref<boolean>(false)
const autoUpdateStore = useAutoUpdateStore()

autoUpdate.value = autoUpdateStore.autoUpdate

const setAutoUpdate = (payload) => {
  autoUpdateStore.setAutoUpdate(payload)

  window['app']
    ?.setAutoUpdate(payload)
    .then(() => console.log('autoUpdateSet'))
    .catch((error) => console.error('failedToSetAutoUpdate', error))
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <div class="font-semibold">Auto update</div>
      <div class="max-w-52 text-xs text-neutral-500 dark:text-neutral-400">
        Automatically check and download updates. New updates will be installed when the app is
        closed
      </div>
    </div>
    <toggler-component v-model="autoUpdate" @changed="setAutoUpdate" />
  </div>
</template>

<style scoped></style>
