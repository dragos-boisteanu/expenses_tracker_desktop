<script setup lang="ts">
import ExportComponent from '@/components/settings/importExport/exportComponent.vue'
import ImportComponent from '@/components/settings/importExport/importComponent.vue'
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <div class="font-bold">Import & Export data</div>
    <export-component />
    <import-component />
  </div>
</template>

<style scoped></style>
