<script setup lang="ts">
import LoadingIndicator from '@/components/loadingIndicator.vue'
const props = defineProps({
  isDisabled: { type: Boolean, default: false },
  isLoading: { type: Boolean, default: false },
})

const emits = defineEmits(['click'])
</script>

<template>
  <button
    class="align-center group hover-bg-neutral-200 hover flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-300/50 p-2 hover:bg-neutral-300/75 active:scale-95 active:bg-neutral-300/100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600/70 dark:active:bg-neutral-600/100"
    @click="emits('click')"
    :class="{
      'pointer-events-none !bg-neutral-200 dark:!bg-neutral-700': props.isDisabled,
      'pointer-events-none': props.isLoading,
    }"
  >
    <loading-indicator v-if="props.isLoading" />
    <span
      v-else
      class="text-neutral-700 dark:text-neutral-200"
      :class="{ '!text-neutral-300 dark:!text-neutral-400': props.isDisabled }"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style scoped></style>
