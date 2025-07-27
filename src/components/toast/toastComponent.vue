<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  type: { type: String, required: false, default: '' },
  text: { type: String, required: true },
  path: { type: String, required: false, default: '' },
  duration: { type: Number, required: true },
})

const emits = defineEmits(['close'])

const selfCloseTimeout = ref<number>(0)
onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  clearTimeout(selfCloseTimeout.value)
})

let timerStop = 0
let timerStart = 0

const startTimer = (resumeTime = 0) => {
  timerStart = new Date().getTime()
  timerStop = 0
  selfCloseTimeout.value = window.setTimeout(() => {
    close()
  }, props.duration - resumeTime)
}
const handleMouseEnter = () => {
  timerStop = new Date().getTime()
  clearTimeout(selfCloseTimeout.value)
}

const handleMouseLeave = () => {
  const resumeTime = timerStop - timerStart
  startTimer(resumeTime)
}

const close = () => {
  emits('close')
}
</script>

<template>
  <div
    @click="close"
    @mouseleave="handleMouseLeave"
    @mouseenter="handleMouseEnter"
    class="bg-lime flex w-full min-w-64 cursor-pointer items-center justify-between gap-x-4 rounded-lg p-3 shadow hover:brightness-110"
    :class="{
      // 'bg-red-500': props.type === 'error',
      // 'bg-green-500': props.type === 'success',
      // 'bg-amber-500': props.type === 'warning',
      'bg-indigo-600': props.type === '',
    }"
  >
    <div class="max-w-80 overflow-x-hidden text-xs text-nowrap text-ellipsis text-neutral-100">
      {{ props.text }}
    </div>

    <!--    <button @click="close()" class="cursor-pointer">-->
    <!--      <XMarkIcon class="size-5 text-neutral-100" />-->
    <!--    </button>-->
  </div>
</template>

<style scoped></style>
