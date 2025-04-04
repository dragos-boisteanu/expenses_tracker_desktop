<script setup lang="ts">
const props = defineProps({
  value: { type: Number, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
})
</script>

<template>
  <div class="mt-3 flex w-full items-baseline justify-between gap-1.5 text-sm text-gray-700">
    <div class="flex items-center gap-x-1">
      <div class="">
        {{ props.value }}
      </div>
      <div>
        {{ props.currency }}
      </div>
    </div>
    <div class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800"></div>
    <div>{{ props.date }}</div>
  </div>
</template>

<style scoped></style>
