<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number || String,
    required: false,
    default: 0,
  },
  dot: { type: Boolean, required: false, default: false },
})
</script>

<template>
  <div class="relative size-fit">
    <slot></slot>
    <div
      v-if="typeof props.count === 'string' || props.count > 0"
      class="absolute -top-1 -right-1 rounded-full bg-indigo-600 px-1 text-xs text-white"
    >
      {{ props.count }}
    </div>
    <div
      v-else-if="props.dot"
      class="absolute top-0 right-0 size-2 rounded-full bg-indigo-600 px-1 text-xs text-white"
    ></div>
  </div>
</template>

<style scoped></style>
