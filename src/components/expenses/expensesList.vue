<script setup lang="ts">
import ExpenseComponent from '@/components/expenses/expenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseDetailsDialog from '@/components/expenses/expenseDetailsDialog.vue'
import { onMounted, ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import { VList } from 'virtua/vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import LoadingIndicator from '@/components/loadingIndicator.vue'
import type { DayTotalType } from '@/types/DayTotalType'
import type { DateClickedPayloadType } from '@/types/DateClickedPayloadType'
import DayTotalsDialog from '@/components/expenses/dayTotalsDialog.vue'

const expensesStore = useExpensesStore()

const showDeleteDialog = ref<boolean>(false)
const selectedExpense = ref<ViewExpense>({
  numericValue: 0,
  createdAt: '',
  description: undefined,
  updatedAt: '',
  id: null,
  value: '',
  currency: '',
  date: '',
  unixDate: null,
  unixCreatedAt: 0,
})

const handleExpenseSelected = (expense: ViewExpense) => {
  selectedExpense.value = expense
  showDeleteDialog.value = true
}

const closeDeleteDialog = () => {
  selectedExpense.value = {
    createdAt: undefined,
    description: undefined,
    updatedAt: undefined,
    id: null,
    value: '',
    currency: '',
    date: '',
    unixDate: null,
    unixCreatedAt: 0,
    numericValue: 0,
  }
  showDeleteDialog.value = false
}

const rootRef = ref<HTMLDivElement | null>(null)
const virtualListRef = ref<any>(null)

onMounted(() => {
  if (!rootRef.value) return

  // Initialize OverlayScrollbars on the outer padded card container
  const [initialize] = useOverlayScrollbars({
    defer: false,
    options: {
      scrollbars: {
        visibility: 'visible',
        autoHide: 'leave',
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
  })

  // Target rootRef so scrollbar stays inside card paddings
  initialize({
    target: rootRef.value,
    elements: {
      viewport: virtualListRef.value?.$el || rootRef.value,
    },
  })
})

const isLoadingMore = ref(false)
const handleOnScroll = async (offset: number) => {
  if (!virtualListRef.value || isLoadingMore.value || expensesStore.allLoaded) {
    return
  }

  try {
    const threshold = 20
    const scrollSize = virtualListRef.value.scrollSize
    const clientHeight = virtualListRef.value.$el?.clientHeight || 0

    if (offset + clientHeight >= scrollSize - threshold) {
      isLoadingMore.value = true
      await expensesStore.getExpenses(false, true)
    }
  } catch (error) {
    console.error('loadMoreExpenses', error)
  } finally {
    isLoadingMore.value = false
  }
}

const dayTotals = ref<DayTotalType>(null)
const handleDateClicked = async (payload: DateClickedPayloadType) => {
  const expenses = await expensesStore.getExpensesForDate(payload.date)
  dayTotals.value = {
    expenses,
    date: payload.formattedDate,
  }
}

const closeTotals = () => (dayTotals.value = null)
</script>

<template>
  <day-totals-dialog v-if="dayTotals" :totals="dayTotals" @close="closeTotals" />

  <!-- Outer Card with padding (p-3 pr-1 gives scrollbar space away from edges) -->
  <div
    ref="rootRef"
    data-overlayscrollbars-initialize=""
    class="relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-neutral-50 p-2.5
      dark:bg-neutral-800 shadow"
  >
    <expense-details-dialog
      v-if="showDeleteDialog"
      @close="closeDeleteDialog"
      :expense="selectedExpense"
    />
    <div class="absolute bottom-2 z-99 flex size-8 w-full justify-center" v-if="isLoadingMore">
      <loading-indicator />
    </div>

    <!-- Virtualized List with right-padding gap (pr-2.5) -->
    <VList
      ref="virtualListRef"
      :data="expensesStore.list"
      :style="{ height: '100%' }"
      class="h-full w-full pr-2.5"
      #default="{ item, index }"
      @scroll="handleOnScroll"
    >
      <expense-component
        :index="index"
        :date="item.date"
        :unixDate="Number.parseInt(item.unixDate)"
        :value="item.value"
        :currency="item.currency"
        :id="item.id"
        @dateClicked="handleDateClicked"
        @select="handleExpenseSelected(item)"
      />
    </VList>
  </div>
</template>
