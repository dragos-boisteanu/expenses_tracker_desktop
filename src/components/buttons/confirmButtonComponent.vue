<script setup lang="ts"></script>
<!--TODO: add props for disabled and loading-->
<template>
  <button
    class="cursor-pointer rounded-lg p-2 text-indigo-600 hover:bg-indigo-200/30 active:scale-95 active:bg-indigo-200/20 dark:text-indigo-500 dark:hover:bg-indigo-500/10 dark:active:bg-indigo-500/20"
  >
    <div>
      <slot />
    </div>
  </button>
</template>

<style scoped></style>
