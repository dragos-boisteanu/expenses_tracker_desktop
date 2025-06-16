<script setup lang="ts">
import ExportComponent from '@/components/settings/data/exportComponent.vue'
import ImportComponent from '@/components/settings/data/importComponent.vue'
import DeleteAllComponent from '@/components/settings/data/deleteAllComponent.vue'
</script>

<template>
  <div class="flex flex-col gap-y-4">
    <export-component />
    <import-component />
    <delete-all-component />
  </div>
</template>

<style scoped></style>
