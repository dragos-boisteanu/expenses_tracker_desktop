<script setup lang="ts">
import SettingsDialogComponent from '@/components/settings/settingsDialogComponent.vue'
import { CogIcon } from '@heroicons/vue/24/outline'

import { ref } from 'vue'

const showSettingsDialog = ref<boolean>(false)
</script>

<template>
  <div class="flex items-center">
    <settings-dialog-component v-if="showSettingsDialog" @close="showSettingsDialog = false" />

    <button class="group size-5 cursor-pointer rounded-full" @click="showSettingsDialog = true">
      <CogIcon
        class="size-fit rounded-full text-neutral-800 group-hover:text-neutral-600 group-active:text-neutral-900 dark:text-neutral-300 group-hover:dark:text-neutral-50 group-active:dark:text-neutral-400"
      />
    </button>
  </div>
</template>

<style scoped></style>
