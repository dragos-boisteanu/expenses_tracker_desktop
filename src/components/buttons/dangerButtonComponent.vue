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
    class="min-w-20 group dark:bg-red-400/10 hover:dark:bg-red-400/20 flex justify-center
      items-center bg-red-50/80 hover:bg-red-100 py-1.5 px-3 rounded-xl cursor-pointer duration-150
      active:scale-95 transition-all active:bg-red-200 active:dark:bg-red-600/40
      active:inset-shadow-md"
    @click="emits('click')"
    :class="{
      'pointer-events-none bg-neutral-200! dark:bg-neutral-700!': props.disabled,
      'pointer-events-none': props.loading,
    }"
  >
    <div class="size-4" v-if="props.loading">
      <loading-indicator />
    </div>
    <span
      v-else
      class="max-w-40 text-sm font-semibold min-w-fit overflow-hidden text-ellipsis
        whitespace-nowrap text-red-600 dark:text-red-400 group-hover:dark:text-red-500
        group-active:dark:text-red-600 group-hover:text-red-500 group-active:text-red-700"
      :class="{ 'text-neutral-300! dark:text-neutral-400!': props.disabled }"
    >
      <slot></slot>
    </span>
  </button>
</template>

<style scoped></style>
