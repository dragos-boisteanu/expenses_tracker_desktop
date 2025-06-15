<script setup lang="ts">
import { XMarkIcon, MinusIcon } from '@heroicons/vue/24/outline'

const closeApp = () => {
  window['app']?.close()
}
const minimizeApp = () => {
  window['app']?.minimizeApp()
}
</script>

<template>
  <div class="flex items-center gap-x-4">
    <button class="drag--disabled group size-5 cursor-pointer rounded-full" @click="minimizeApp">
      <MinusIcon
        class="size-fit rounded-full text-neutral-700 group-hover:text-neutral-600 group-active:text-neutral-800 dark:text-neutral-300 group-hover:dark:text-neutral-50 group-active:dark:text-neutral-400"
      />
    </button>
    <button class="drag--disabled group size-5 cursor-pointer rounded-full" @click="closeApp">
      <XMarkIcon
        class="size-fit rounded-full text-neutral-700 group-hover:text-red-600 group-active:text-red-700 dark:text-neutral-300"
      />
    </button>
  </div>
</template>

<style scoped></style>
