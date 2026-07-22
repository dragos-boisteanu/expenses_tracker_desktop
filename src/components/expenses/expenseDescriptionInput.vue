<script setup lang="ts">
import { ref } from 'vue'
import type { JSONContent } from '@tiptap/vue-3'
import DialogComponent from '@/components/dialogComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import TiptapEditor from '@/components/TiptapEditor.vue' // Adjust path to where you saved it

// If you want to open this dialog to EDIT existing content, accept it as a prop
const props = defineProps<{
  initialContent?: JSONContent
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'add', description?: JSONContent): void
}>()

// Initialize with props.initialContent if editing, otherwise it starts empty
const descriptionContent = ref<JSONContent | null>(props.initialContent || null)

const close = () => emits('close')

const add = () => {
  if (!descriptionContent.value) {
    emits('add')
    return
  }
  emits('add', descriptionContent.value)
}
</script>

<template>
  <dialog-component :hide-close-button="true">
    <template #title> Add a description </template>

    <template #default>
      <div
        class="h-64 w-full overflow-x-hidden rounded-2xl bg-neutral-50 shadow dark:bg-neutral-900"
      >
        <!-- Reusable Editor Component using v-model -->
        <TiptapEditor v-model="descriptionContent" />
      </div>
    </template>

    <template #actions>
      <cancel-button-component @click="close()"> Cancel </cancel-button-component>
      <confirm-button-component @click="add()"> Save </confirm-button-component>
    </template>
  </dialog-component>
</template>
