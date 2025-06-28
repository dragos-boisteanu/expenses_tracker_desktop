<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import DataSettingComponent from '@/components/settings/data/dataSettingComponent.vue'
import ThemeToggleComponent from '@/components/themeToggleComponent.vue'
import SystemStartUp from '@/components/settings/system/systemStartUp.vue'

const emits = defineEmits(['close'])

const close = () => {
  emits('close')
}
</script>

<template>
  <dialog-component @close="close">
    <template #title>Settings</template>
    <template #default>
      <div class="flex size-full flex-col gap-y-4">
        <data-setting-component />
        <hr class="text-neutral-300 dark:text-neutral-600" />
        <theme-toggle-component />
        <hr class="text-neutral-300 dark:text-neutral-600" />
        <system-start-up />
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
