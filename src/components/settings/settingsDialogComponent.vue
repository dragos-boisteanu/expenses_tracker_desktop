<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import DataSettingComponent from '@/components/settings/data/dataSettingComponent.vue'
import SystemSettingsComponent from '@/components/settings/system/systemSettingsComponent.vue'

const emits = defineEmits(['close'])

const close = () => {
  emits('close')
}
</script>

<template>
  <dialog-component @close="close">
    <template #title>Settings</template>
    <template #default>
      <div class="flex size-full flex-col gap-y-2">
        <data-setting-component />
        <system-settings-component />
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
