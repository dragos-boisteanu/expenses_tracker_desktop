<script setup lang="ts">
const model = defineModel({ required: true })
const emits = defineEmits(['changed'])
const toggle = () => {
  model.value = !model.value
  emits('changed', !model.value)
}
</script>

<template>
  <button
    class="group relative flex h-6 w-10 cursor-pointer items-center rounded-4xl bg-neutral-200
      dark:bg-neutral-700"
    @click="toggle"
    :class="{ 'dark:bg-indigo-600! bg-indigo-500!': model }"
  >
    <div
      class="size-4 translate-x-1 transform rounded-full bg-white shadow transition-all duration-200
        group-hover:bg-neutral-50 dark:bg-neutral-200 group-hover:dark:bg-neutral-100"
      :class="{ 'translate-x-5': model }"
    />
  </button>
</template>

<style scoped></style>
