<script setup lang="ts">
import LoadingIndicator from '@/components/loadingIndicator.vue'
const props = defineProps({
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
})

const emits = defineEmits(['click'])
</script>

<template>
  <button
    class="align-center group hover-bg-neutral-200 hover flex min-w-16 cursor-pointer justify-center rounded-lg bg-neutral-300/50 p-2 hover:bg-neutral-300/75 active:scale-95 active:bg-neutral-300/100 dark:bg-neutral-600/50 dark:hover:bg-neutral-600/70 dark:active:bg-neutral-600/100"
    @click="emits('click')"
    :class="{
      'pointer-events-none !bg-neutral-200 dark:!bg-neutral-700': props.disabled,
      'pointer-events-none': props.loading,
    }"
  >
    <div class="size-2" v-if="props.loading">
      <loading-indicator />
    </div>
    <span
      v-else
      class="text-neutral-700 dark:text-neutral-200"
      :class="{ '!text-neutral-300 dark:!text-neutral-400': props.disabled }"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style scoped></style>
