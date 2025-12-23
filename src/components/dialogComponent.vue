<script setup lang="ts">
import CloseButtonComponent from '@/components/buttons/closeButtonComponent.vue'
import { onMounted, ref } from 'vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'

const emits = defineEmits(['close'])
const rootRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (!rootRef.value) {
    return
  }

  const root = rootRef.value

  const [initialize] = useOverlayScrollbars({
    defer: false,
    options: {
      scrollbars: {
        visibility: 'auto',
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
  })

  initialize({
    target: root,
    elements: {
      viewport: root.firstElementChild as HTMLElement,
    },
  })
})
</script>

<template>
  <Teleport to="#app-container">
    <slot name="dialog"></slot>
    <div class="fixed top-0 left-0 z-10 flex size-full items-center justify-center bg-black/75">
      <div
        class="max-w-[90%] min-w-[90%] rounded-2xl bg-neutral-50 shadow dark:bg-neutral-800"
        ref="dialogContent"
      >
        <div class="flex items-center justify-between px-4 py-2">
          <div class="text-lg font-semibold text-neutral-800 dark:text-gray-200">
            <slot name="title"></slot>
          </div>

          <close-button-component @close="emits('close')" />
        </div>
        <div
          ref="rootRef"
          class="text-md max-h-96 overflow-y-scroll px-4 py-2 text-sm text-neutral-800 dark:border-neutral-600 dark:text-gray-300"
        >
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
