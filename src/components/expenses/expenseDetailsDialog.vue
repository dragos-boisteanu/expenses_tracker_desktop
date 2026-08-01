<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import { computed, ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import DangerButtonComponent from '@/components/buttons/dangerButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseDetailsDescription from '@/components/expenses/expenseDetailsDescription.vue'
import dayjs from '@/plugins/dayjs'
import ExpenseValueDetailComponent from '@/components/expenses/expenseValueDetailComponent.vue'

const props = defineProps<{
  expense: ViewExpense
}>()
const emits = defineEmits(['close', 'cancel'])
const close = () => {
  if (isEditing.value) {
    closeEdit.value = true
    return
  }
  emits('close')
}

const formatedDate = computed(() => dayjs.unix(props.expense.unixDate).format('DD/MM/YYYY HH:mm'))

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

const closeEdit = ref<boolean>(false)
const isEditing = ref<boolean>(false)
</script>

<template>
  <dialog-component @close="close">
    <template #title> Expense details </template>

    <div class="w-full">
      <div class="flex items-center justify-between gap-x-2">
        <expense-value-detail-component
          :id="expense.id"
          :value="expense.value"
          :numericValue="expense.numericValue"
          :currency="expense.currency"
        />
        <div class="flex-1 rounded-xl bg-neutral-100 p-3 shadow dark:bg-neutral-900">
          <div class="font-semibold text-neutral-800 dark:text-neutral-100">Date</div>
          <div class="mt-1 text-sm text-neutral-700 dark:text-neutral-400">
            {{ formatedDate }}
          </div>
        </div>
      </div>
      <expense-details-description :id="expense.id" :description="expense.description" />

      <div
        class="mt-1.5 text-end text-xs text-neutral-400 dark:text-neutral-600"
        v-if="expense.updatedAt"
      >
        Last update on: {{ expense.updatedAt }}
      </div>
      <div
        class="mt-1.5 text-end text-xs text-neutral-400 dark:text-neutral-600"
        v-if="expense.unixCreatedAt !== expense.unixDate"
      >
        Created at: {{ expense.createdAt }}
      </div>
    </div>

    <template #actions>
      <cancel-button-component @click="close">Close</cancel-button-component>
      <danger-button-component @click="toggleConfirmDialog"> Delete </danger-button-component>
    </template>
    <template #dialog v-if="showConfirmDialog">
      <dialog-component @close="toggleConfirmDialog">
        <template #title> Confirm </template>
        <template #default> Are you sure you want to delete this entry ? </template>
        <template #actions>
          <cancel-button-component @click="toggleConfirmDialog">Close</cancel-button-component>

          <danger-button-component @click="remove"> Delete </danger-button-component>
        </template>
      </dialog-component>
    </template>
  </dialog-component>
</template>
