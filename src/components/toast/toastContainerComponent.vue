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

<style scoped></style>
