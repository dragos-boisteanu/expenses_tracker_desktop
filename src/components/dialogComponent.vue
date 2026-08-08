<script setup lang="ts">
import CloseButtonComponent from '@/components/buttons/closeButtonComponent.vue'
import { PropType } from 'vue'

const emits = defineEmits(['close'])

const props = defineProps({
  hideCloseButton: {
    type: Boolean,
    required: false,
    default: false,
  },
  position: {
    type: String as PropType<'top' | 'center' | 'button'>,
    required: false,
    default: 'center',
  },
})

//TODO: close the highest level dialog when pressing esc
/*onMounted(() => {
  window.addEventListener('keydown', handleKeyPress)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

const handleKeyPress = (e: KeyboardEvent): void => {
  console.log('handleKeyPress', e)
  if (e.key === 'Escape') {
    close()
  }
}*/
const close = () => {
  emits('close')
}
</script>

<template>
  <Teleport to="#app-container">
    <slot name="dialog"></slot>
    <div
      class="fixed top-0 left-0 z-10 flex size-full items-center justify-center overflow-hidden bg-black/75"
      :class="{ 'items-start pt-8': props.position === 'top' }"
    >
      <div class="max-w-[90%] min-w-[90%] rounded-2xl bg-neutral-50 shadow dark:bg-neutral-800">
        <div class="flex items-center justify-between p-4">
          <div class="text-xl font-semibold text-neutral-800 dark:text-gray-300">
            <slot name="title"></slot>
          </div>

          <close-button-component v-if="!hideCloseButton" @close="close" />
        </div>
        <div class="text-md px-4 text-neutral-800 dark:border-neutral-600 dark:text-gray-300">
          <slot />
        </div>
        <div class="0 flex items-center justify-end gap-x-4 px-4 py-2">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
<!--border-t border-b border-neutral-200-->
