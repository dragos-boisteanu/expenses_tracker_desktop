<script setup lang="ts">
const props = defineProps({
  date: { type: String, required: true },
})
</script>

<template>
  <div
    class="flex h-9 w-full items-center justify-between gap-1.5 py-2 text-xs text-indigo-600 dark:text-indigo-500"
  >
    <div class="h-fit flex-1 border-b border-b-indigo-600 dark:border-b-indigo-500"></div>
    <div>{{ props.date }}</div>
    <div class="h-fit flex-1 border-b border-b-indigo-600 dark:border-b-indigo-500"></div>
  </div>
</template>

<style scoped></style>
