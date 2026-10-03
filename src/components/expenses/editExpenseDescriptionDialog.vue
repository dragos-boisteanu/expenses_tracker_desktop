<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import { JSONContent } from '@tiptap/vue-3'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { ref } from 'vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import { useToastStore } from '@/stores/toast'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

const props = defineProps<{
  description?: JSONContent
  id: number
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const description = ref<JSONContent>(props.description)

let isUpdating = false

const save = async (): Promise<void> => {
  if (isUpdating) {
    return
  }

  isUpdating = true

  const toastStore = useToastStore()

  try {
    const expensesStore = useExpensesStore()
    await expensesStore.updateExpenseDescription(props.id, description.value)

    toastStore.add({
      text: 'Successfully updated description',
    })

    close()
  } catch (error) {
    console.error('updateExpenseDescription', error)
    toastStore.add({
      text: 'Failed to update description',
    })
  } finally {
    isUpdating = false
  }
}

const close = () => {
  emits('close')
}
</script>

<template>
  <dialog-component @close="close()">
    <template #title>Edit description</template>
    <template #default
      ><div class="h-36 rounded-2xl bg-neutral-50 text-sm shadow dark:bg-neutral-900">
        <TiptapEditor v-model="description" />
      </div>
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>
      <general-button-component @click="save">Save</general-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
