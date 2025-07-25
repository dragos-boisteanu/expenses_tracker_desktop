<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  type: { type: String, default: '' },
  text: { type: String, required: true },
  time: { type: Number, default: 10000 },
})

const emits = defineEmits(['close'])
const close = () => {
  emits('close')
}
</script>

<template>
  <div
    class="bg-lime flex w-full min-w-64 cursor-pointer items-center justify-between gap-x-4 rounded-lg p-3 shadow hover:brightness-110"
    :class="{
      'bg-red-500': props.type === 'error',
      'bg-green-500': props.type === 'success',
      'bg-amber-500': props.type === 'warning',
      'bg-indigo-600': props.type === '',
    }"
  >
    <div class="max-w-80 overflow-x-hidden text-nowrap text-ellipsis text-neutral-100">
      {{ props.text }}
    </div>

    <button @click="close()" class="cursor-pointer">
      <XMarkIcon class="size-5 text-neutral-100" />
    </button>
  </div>
</template>

<style scoped></style>
