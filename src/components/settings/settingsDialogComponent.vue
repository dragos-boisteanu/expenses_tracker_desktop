<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import DataSettingComponent from '@/components/settings/data/dataSettingComponent.vue'
import ThemeToggleComponent from '@/components/themeToggleComponent.vue'
import SystemStartUp from '@/components/settings/system/systemStartUp.vue'
import AutoUpdateComponent from '@/components/settings/system/updates/autoUpdateComponent.vue'
import CheckForUpdateComponent from '@/components/settings/system/updates/checkForUpdateComponent.vue'
import HardwareAccelerationSettingComponent from '@/components/settings/system/hardwareAccelerationSettingComponent.vue'
import AutoInstallUpdateComponent from '@/components/settings/system/updates/autoInstallUpdateComponent.vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'
import { onMounted, ref } from 'vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'

const emits = defineEmits(['close'])

const autoUpdateStore = useAutoUpdateStore()

const rootRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!rootRef.value) return

  const [initialize] = useOverlayScrollbars({
    defer: false,
    options: {
      scrollbars: {
        visibility: 'auto',
        autoHide: 'leave', // Hides scrollbar when not hovering for a cleaner look
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
  })

  // Initialize directly on the root element
  initialize(rootRef.value)
})

const close = () => {
  emits('close')
}
</script>

<template>
  <dialog-component @close="close">
    <template #title>Settings</template>

    <template #default>
      <!-- Scroll container with internal padding -->
      <div ref="rootRef" class="h-96 pr-3 pl-1 py-1">
        <div class="flex flex-col gap-y-4 pr-2">
          <data-setting-component />
          <hr class="border-neutral-200 dark:border-neutral-700" />

          <theme-toggle-component />
          <hr class="border-neutral-200 dark:border-neutral-700" />

          <auto-update-component />
          <auto-install-update-component v-if="autoUpdateStore.autoUpdate" />
          <check-for-update-component />
          <hr class="border-neutral-200 dark:border-neutral-700" />

          <system-start-up />
          <hardware-acceleration-setting-component />
        </div>
      </div>
    </template>
  </dialog-component>
</template>
