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
      <div class="size-full">
        <export-import-setting-dialog />
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
