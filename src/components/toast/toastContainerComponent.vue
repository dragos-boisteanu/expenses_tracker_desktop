<script setup lang="ts">
import ToastComponent from '@/components/toast/toastComponent.vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const handleCloseToast = (id: number) => {
  toastStore.remove(id)
}
</script>

<template>
  <TransitionGroup name="toast">
    <toast-component
      v-for="toast in toastStore.list"
      :key="toast.id"
      :text="toast.text"
      :link="toast.path"
      :type="toast.type"
      :duration="toast.duration"
      @close="handleCloseToast(toast.id)"
    />
  </TransitionGroup>
</template>

<style>

/* ENTER */
.toast-enter-from {
  transform: translateY(150%);
}
.toast-enter-to {
  transform: translateY(0);
}
.toast-enter-active {
  transition: transform 0.5s ease-in-out;
}

/* LEAVE */
.toast-leave-from {
  transform: translateY(0);
}
.toast-leave-to {
  transform: translateY(150%);
}
.toast-leave-active {
  transition: transform 0.5s ease-in-out;
}

.toast-move {
  transition: transform 0.5s ease-in-out;
}
</style>
