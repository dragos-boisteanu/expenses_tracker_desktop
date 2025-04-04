<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import ExpenseComponent from '@/components/ExpenseComponent.vue'
import type { Expense } from '@/types/expense.ts'
import { computed, ref } from 'vue'
import { ExpensesService } from '@/services/expensesService.ts'

const value = ref(0)
const expenses = ref<Expense[]>([])
const expensesService = new ExpensesService()

expenses.value = expensesService.getExpenses()
const addExpense = () => {
  expensesService.addExpense(value.value)
  expenses.value = expensesService.getExpenses()
  value.value = 0
}
</script>

<template>
  <div class="flex size-full">
    <div class="h-full w-1/3 border-r-[1px] border-r-neutral-200 bg-neutral-50 py-4 shadow-2xl">
      <div class="mb-8 w-full text-center text-3xl text-gray-800">Expenses</div>
      <div class="overflow-y-auto bg-transparent p-4">
        <expense-component
          :date="expense.date"
          :value="expense.value"
          v-for="expense in expenses"
          :key="expense.id"
        />
        <!--        <div class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600">
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
          <div>Yesterday</div>
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
        </div>
        <expense-component date="12/12/2005" :value="500" v-for="index in 4" :key="index" />
        <div class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600">
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
          <div>24/12/2004</div>
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
        </div>
        <expense-component date="11/12/2005" :value="500" v-for="index in 4" :key="index" />
      </div>-->
      </div>
    </div>
    <div class="flex h-full flex-1 flex-col items-center justify-center gap-12 bg-neutral-100">
      <div class="h-fit w-2/3 rounded-2xl bg-neutral-50">
        <input
          v-model.number="value"
          class="size-full rounded-2xl border-2 border-transparent bg-transparent p-4 text-xl text-gray-700 shadow outline-none focus:border-b-indigo-600"
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
  </div>
</template>
