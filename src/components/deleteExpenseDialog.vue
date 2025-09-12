<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import { ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { useExpensesStore } from '@/stores/expenses'

const props = defineProps<{
  expense: ViewExpense
}>()
const emits = defineEmits(['close', 'cancel'])
const close = () => {
  emits('close')
}

const showConfirmDialog = ref<boolean>(false)
const toggleConfirmDialog = () => {
  showConfirmDialog.value = !showConfirmDialog.value
}
const remove = async () => {
  try {
    const expensesStore = useExpensesStore()
    await expensesStore.removeExpense(props.expense.id)
    close()
  } catch (error) {
    // TODO: show notification
    console.error('removeExpense', error)
  }
}
</script>

<template>
  <dialog-component @close="close">
    <template #title> Delete entry </template>
    <template #default>
      <div>
        Are you sure you want to delete the expense from
        <span class="font-semibold">{{ props.expense.date }}</span> of
        <span class="font-semibold"> {{ props.expense.value }} {{ props.expense.currency }}</span> ?
      </div>
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>

      <danger-button-component @click="toggleConfirmDialog"> Delete </danger-button-component>
    </template>
    <template #dialog v-if="showConfirmDialog">
      <dialog-component @close="toggleConfirmDialog">
        <template #title> Confirm </template>
        <template #default> Are you sure you want to delete this entry ? </template>
        <template #actions>
          <cancel-button-component @click="toggleConfirmDialog">Cancel</cancel-button-component>

          <danger-button-component @click="remove"> Delete </danger-button-component>
        </template>
      </dialog-component>
    </template>
  </dialog-component>
</template>
