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
  if (!rootRef.value) {
    return
  }

  const root = rootRef.value

  const [initialize] = useOverlayScrollbars({
    defer: false,
    options: {
      scrollbars: {
        visibility: 'auto',
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
  })

  initialize({
    target: root,
    elements: {
      viewport: root.firstElementChild as HTMLElement,
    },
  })
})
const close = () => {
  emits('close')
}
</script>

<template>
  <dialog-component @close="close">
    <template #title>Settings</template>
    <template #default>
      <div ref="rootRef" class="h-96">
        <div class="flex size-full flex-col gap-y-4 pr-4!">
          <data-setting-component />
          <hr class="text-neutral-300 dark:text-neutral-600" />
          <theme-toggle-component />
          <hr class="text-neutral-300 dark:text-neutral-600" />
          <auto-update-component />
          <auto-install-update-component v-if="autoUpdateStore.autoUpdate" />
          <check-for-update-component />
          <hr class="text-neutral-300 dark:text-neutral-600" />
          <system-start-up />
          <hardware-acceleration-setting-component />
        </div>
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
