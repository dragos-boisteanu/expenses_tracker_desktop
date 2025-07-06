<script setup lang="ts">
const props = defineProps({
  count: {
    type: Number || String,
    required: false,
    default: 0,
  },
})
</script>

<template>
  <div class="relative size-fit">
    <slot></slot>
    <div
      v-if="typeof count === 'string' || count > 0"
      class="absolute -top-1 -right-1 rounded-full bg-red-600 px-1 text-xs text-white"
    >
      {{ props.count }}
    </div>
  </div>
</template>

<style scoped></style>
