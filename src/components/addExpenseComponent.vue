<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { inject, ref } from 'vue'
import type { ExpensesService } from '@/services/expensesService'

const expensesService = inject<ExpensesService>('expensesService')!
const value = ref(0)

const addExpense = () => {
  expensesService.addExpense(value.value)
  value.value = 0
}
</script>

<template>
  <div class="flex w-full shrink-0 grow-0 flex-col items-center gap-6">
    <div class="h-fit w-full rounded-2xl bg-neutral-50 dark:bg-neutral-800">
      <input
        v-model.number="value"
        class="size-full rounded-2xl border-2 border-transparent bg-transparent p-4 text-xl text-gray-700 shadow outline-none focus:border-b-indigo-600 dark:text-gray-200 dark:focus:border-b-indigo-500"
        type="text"
        inputmode="decimal"
        placeholder="Enter value"
      />
    </div>
    <button
      @click="addExpense"
      class="group flex size-18 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
    >
      <PlusIcon class="size-12 text-neutral-50 group-hover:text-neutral-100" />
    </button>
  </div>
</template>

<style scoped></style>
