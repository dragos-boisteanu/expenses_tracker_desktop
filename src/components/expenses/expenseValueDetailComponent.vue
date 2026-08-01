<script setup lang="ts">
import { ref } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/outline'
import EditExpenseValueDialog from '@/components/expenses/editExpenseValueDialog.vue'

const props = defineProps<{
  id: number
  value: string
  numericValue: number
  currency: string
}>()

const isEditing = ref<boolean>(false)
const toggleEdit = () => {
  isEditing.value = !isEditing.value
}
</script>

<template>
  <edit-expense-value-dialog
    v-if="isEditing"
    :id="props.id"
    :value="props.numericValue"
    :currency="props.currency"
    @close="toggleEdit"
  />
  <div class="flex-1 rounded-xl bg-neutral-100 p-3 shadow dark:bg-neutral-900">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-neutral-800 dark:text-neutral-100">Value</div>
      <button @click="toggleEdit" class="cursor-pointer">
        <PencilIcon class="size-4" />
      </button>
    </div>
    <div class="mt-1 text-sm text-neutral-700 dark:text-neutral-400">
      {{ props.value }}
    </div>
  </div>
</template>

<style scoped></style>
