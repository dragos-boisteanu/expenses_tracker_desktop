<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'
const emits = defineEmits(['close'])
</script>

<template>
  <button
    class="cursor-pointer rounded-full p-2 text-neutral-800 hover:bg-neutral-300/30 active:scale-95 active:bg-neutral-300/20 dark:text-gray-200 dark:hover:bg-neutral-500/10 dark:active:bg-neutral-500/20"
    @click="emits('close')"
  >
    <XMarkIcon class="size-5" />
  </button>
</template>

<style scoped></style>
