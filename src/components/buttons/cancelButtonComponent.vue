<script setup lang="ts">
const emits = defineEmits(['click'])
</script>

<!--TODO: add props for disabled-->
<template>
  <button
    @click="emits('click')"
    class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer
      active:scale-95 bg-neutral-100 text-neutral-700 hover:bg-neutral-200/80 active:bg-neutral-200
      dark:bg-neutral-500/15 dark:text-neutral-400 dark:hover:bg-neutral-500/25
      dark:hover:text-neutral-300 dark:active:bg-neutral-500/35 dark:active:text-neutral-200"
  >
    <slot></slot>
  </button>
</template>

<style scoped></style>
