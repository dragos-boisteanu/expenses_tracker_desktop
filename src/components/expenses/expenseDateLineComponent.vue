<script setup lang="ts">
const props = defineProps({
  date: { type: String, required: true },
})

const emits = defineEmits(['dateClicked'])

const dateClickHandler = () => {
  emits('dateClicked')
}
</script>

<template>
  <div
    class="flex h-9 w-full items-center justify-between gap-1.5 py-2 text-xs text-indigo-600 dark:text-indigo-500"
  >
    <div class="h-fit flex-1 border-b border-b-indigo-600 dark:border-b-indigo-500"></div>
    <div
      @click="dateClickHandler()"
      class="cursor-pointer rounded p-1 hover:bg-neutral-100 hover:text-indigo-600 hover:shadow active:bg-neutral-100/60 dark:hover:bg-neutral-700/50 dark:hover:text-indigo-400 dark:active:bg-neutral-700/75"
    >
      {{ props.date }}
    </div>
    <div class="h-fit flex-1 border-b border-b-indigo-600 dark:border-b-indigo-500"></div>
  </div>
</template>

<style scoped></style>
