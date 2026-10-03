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
    class="group bg-indigo-50/80 dark:bg-indigo-400/10 hover:dark:bg-indigo-400/20
      active:dark:bg-indigo-600/40 hover:bg-indigo-100 py-1.5 px-3 rounded-xl cursor-pointer
      duration-150 active:scale-95 transition-all active:bg-indigo-200 active:inset-shadow-md"
    @click="emits('click')"
    :class="{
      'pointer-events-none bg-neutral-200! dark:bg-neutral-700!': props.disabled,
      'pointer-events-none': props.loading,
    }"
  >
    <span class="size-4" v-if="props.loading">
      <loading-indicator />
    </span>
    <span
      v-else
      class="max-w-40 text-sm font-semibold min-w-fit overflow-hidden text-ellipsis
        whitespace-nowrap text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500
        group-hover:dark:text-indigo-300 group-active:dark:text-indigo-400
        group-active:text-indigo-800"
      :class="{ 'text-neutral-300! dark:text-neutral-400!': props.disabled }"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style scoped></style>
