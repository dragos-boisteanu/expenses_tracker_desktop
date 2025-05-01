<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import ExportImportSettingDialog from '@/components/settings/exportImportSettingDialog.vue'

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
        <export-import-setting-component />
        <delete-all-component />
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
