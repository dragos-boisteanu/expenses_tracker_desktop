<script setup lang="ts">
import { ref } from 'vue'
import ExpenseValueInput from '@/components/expenses/expenseValueInput.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import { Country } from '@/types/country'
import { useExpensesStore } from '@/stores/expenses'
import { useToastStore } from '@/stores/toast'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

const props = defineProps<{
  id: number
  value: number
  currency: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const localValue = ref<number | string | null>(props.value)
const currency = ref<string>(props.currency)

const hasError = ref<boolean>(false)
const isSuccess = ref<boolean>(false)

const handleCountrySelected = (c: Country) => {
  currency.value = c.code
}

const close = () => {
  emits('close')
}

let isUpdating = false

const save = async () => {
  if (isUpdating) {
    return
  }

  isUpdating = true

  const toastStore = useToastStore()

  try {
    let numericValue: number | null
    if (typeof localValue.value === 'string') {
      numericValue = parseFloat(localValue.value)
    } else {
      numericValue = localValue.value
    }

    if (Number.isNaN(numericValue)) {
      throw new Error('Expense value must be a number')
    }
    if (numericValue === 0) {
      throw new Error('Expense might have a value, either negative or positive')
    }

    const expenseStore = useExpensesStore()
    await expenseStore.updateExpenseValue(props.id, numericValue, currency.value)

    toastStore.add({
      text: 'Successfully updated value',
    })

    close()
  } catch (e) {
    console.error('editValue', e)
    toastStore.add({
      text: 'Failed to update value',
    })
  } finally {
    isUpdating = false
  }
}
</script>

<template>
  <dialog-component @close="close">
    <template #title> Edit value </template>
    <template #default>
      <expense-value-input
        :isEditing="true"
        v-model="localValue"
        :currency="currency"
        :error="hasError"
        :success="isSuccess"
        @add="save"
        @countrySelected="handleCountrySelected"
      />
    </template>
    <template #actions>
      <cancel-button-component @click="close">Cancel</cancel-button-component>
      <general-button-component @click="save">Save</general-button-component>
    </template>
  </dialog-component>
</template>

<style scoped></style>
