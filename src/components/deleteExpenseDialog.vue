<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import { inject, ref } from 'vue'
import type { ExpensesService } from '@/services/expensesService.ts'
import type { ViewExpense } from '@/types/viewExpense.ts'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'

const props = defineProps<{
  expense: ViewExpense
}>()
const expensesService = inject<ExpensesService>('expensesService')!
const emits = defineEmits(['close', 'cancel'])
const close = () => {
  emits('close')
}

const showConfirmDialog = ref<boolean>(false)
const toggleConfirmDialog = () => {
  showConfirmDialog.value = !showConfirmDialog.value
}
const remove = () => {
  expensesService.removeExpense(props.expense.id)
  close()
}
</script>

<template>
  <dialog-component @close="close">
    <template #title> Delete entry </template>
    <template #default>
      Are you sure you want to delete the expense from <strong>{{ props.expense.date }}</strong> of
      <strong> {{ props.expense.value }} {{ props.expense.currency }}</strong> ?
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
