<script setup lang="ts">
const model = defineModel({ required: true })
const emits = defineEmits(['changed'])
const toggle = () => {
  model.value = !model.value
  emits('changed', model.value)
}
</script>

<template>
  <button
    class="group relative flex h-4 w-8 cursor-pointer items-center rounded-4xl bg-neutral-200 transition-colors duration-200 dark:bg-neutral-600"
    @click="toggle"
    :class="{ '!bg-green-600': model }"
  >
    <div
      class="size-5 -translate-x-1 transform rounded-full bg-white shadow transition-transform duration-200 group-hover:bg-neutral-50 dark:bg-neutral-200 group-hover:dark:bg-neutral-100"
      :class="{ 'translate-x-4': model }"
    />
  </button>
</template>

<style scoped></style>
