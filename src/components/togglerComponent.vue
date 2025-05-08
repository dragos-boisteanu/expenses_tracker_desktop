<script setup lang="ts">
const model = defineModel({ required: true })
const toggle = () => {
  model.value = !model.value
}
</script>

<template>
  <button
    class="inset-shadow group relative h-4 w-8 cursor-pointer rounded-4xl bg-neutral-200 dark:bg-neutral-600"
    @click="toggle"
    :class="{ '!bg-green-600': model }"
  >
    <div
      class="size-4 translate-x-0 transform rounded-full bg-white shadow transition-transform duration-200 group-hover:bg-neutral-50 dark:bg-neutral-200 group-hover:dark:bg-neutral-100"
      :class="{ 'translate-x-4': model }"
    />
  </button>
</template>

<style scoped></style>
