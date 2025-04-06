<script setup lang="ts">
const props = defineProps({
  value: { type: Number, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
  dayLimiterText: { type: String, required: false, default: '' },
  showDayLimiter: { type: Boolean, required: false, default: false },
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
  <div
    v-if="props.showDayLimiter"
    class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600"
  >
    <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
    <div>{{ props.dayLimiterText }}</div>
    <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
  </div>
</template>

<style scoped></style>
