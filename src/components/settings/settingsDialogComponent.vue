<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import DataSettingComponent from '@/components/settings/data/dataSettingComponent.vue'
import DeleteAllComponent from '@/components/settings/data/deleteAllComponent.vue'

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
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
