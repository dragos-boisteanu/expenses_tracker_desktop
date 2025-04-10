<script setup lang="ts"></script>

<template>
  <button
    class="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-200/30 active:bg-red-200/20 dark:text-red-500 dark:hover:bg-red-500/10 dark:active:bg-red-500/20"
  >
    <div>
      <slot />
    </div>
  </button>
</template>

<style scoped></style>
