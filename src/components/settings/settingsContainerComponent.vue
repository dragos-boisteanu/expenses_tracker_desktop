<script setup lang="ts">
import SettingsDialogComponent from '@/components/settings/settingsDialogComponent.vue'
import { CogIcon } from '@heroicons/vue/24/outline'

import { ref } from 'vue'
import BadgeComponent from '@/components/badgeComponent.vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'

const showSettingsDialog = ref<boolean>(false)

const autoUpdateStore = useAutoUpdateStore()
</script>

<template>
  <div class="flex items-center" @click="showSettingsDialog = true">
    <settings-dialog-component v-if="showSettingsDialog" @close="showSettingsDialog = false" />

    <badge-component :dot="autoUpdateStore.isUpdateDownloaded || autoUpdateStore.isUpdateAvailable">
      <button class="group size-5 cursor-pointer rounded-full">
        <CogIcon
          class="size-fit rounded-full text-neutral-800 group-hover:text-neutral-600 group-active:text-neutral-900 dark:text-neutral-300 group-hover:dark:text-neutral-50 group-active:dark:text-neutral-400"
        />
      </button>
    </badge-component>
  </div>
</template>

<style scoped></style>
