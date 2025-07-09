<script setup lang="ts">
// import { useSystemStore } from '@/stores/system'
import TogglerComponent from '@/components/togglerComponent.vue'
import { ref, watch } from 'vue'
import { useSystemStore } from '@/stores/system'

const systemStore = useSystemStore()

const launchAppAtSystemStartup = ref<boolean>(systemStore.launchAtSystemStartup)
watch(
  () => launchAppAtSystemStartup.value,
  (value) => {
    window['app']?.setLaunchAtSystemStartup(value)
    systemStore.setLaunchAtSystemStartup(value)
  },
)
</script>

<template>
  <div class="flex items-center justify-between">
    <div>
      <div class="font-semibold">Startup</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">Launch app at system startup</div>
    </div>
    <toggler-component v-model="launchAppAtSystemStartup" />
  </div>
</template>

<style scoped></style>
