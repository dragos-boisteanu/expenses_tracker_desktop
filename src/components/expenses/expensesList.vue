<script setup lang="ts">
import ExpenseComponent from '@/components/expenses/expenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import DeleteExpenseDialog from '@/components/deleteExpenseDialog.vue'
import { inject, onMounted, ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import { VList } from 'virtua/vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import { ExpensesService } from '@/services/expensesService'

const expensesStore = useExpensesStore()

const showDeleteDialog = ref<boolean>(false)
const selectedExpense = ref<ViewExpense>({
  id: null,
  value: '',
  currency: '',
  date: '',
  unixDate: null,
})

const handleExpenseSelected = (expense: ViewExpense) => {
  selectedExpense.value = expense
  showDeleteDialog.value = true
}
const closeDeleteDialog = () => {
  selectedExpense.value = {
    id: null,
    value: '',
    currency: '',
    date: '',
    unixDate: null,
  }
  showDeleteDialog.value = false
}

// console.log('initialize', initialize)
const rootRef = ref<HTMLDivElement | null>(null)

onMounted(() => {
  const root = rootRef.value

  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        visibility: 'visible',
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

const expenseServices = inject('expenseServices') as ExpensesService
const virtualListRef = ref<HTMLDivElement | null>(null)
const handleOnScrollEnd = async () => {
  // TODO: add loading indicator
  await expenseServices.getExpenses(true)
}
</script>

<template>
  <div class="size-full rounded-2xl bg-transparent">
    <delete-expense-dialog
      v-if="showDeleteDialog"
      @close="closeDeleteDialog"
      :expense="selectedExpense"
    />

    <div
      ref="rootRef"
      data-overlayscrollbars-initialize=""
      class="h-full rounded-2xl bg-neutral-50 p-2 shadow dark:bg-neutral-800"
    >
      <VList
        ref="virtualListRef"
        :data="expensesStore.list"
        :style="{ height: 'none' }"
        class="rounded-2xl"
        #default="{ item }"
        @scrollEnd="handleOnScrollEnd"
      >
        <expense-component
          :date="item.date"
          :value="item.value"
          :currency="item.currency"
          :id="item.id"
          @select="handleExpenseSelected(item)"
        />
      </VList>
    </div>
  </div>
</template>

<style></style>
