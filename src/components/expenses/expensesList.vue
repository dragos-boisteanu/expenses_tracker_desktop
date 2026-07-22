<script setup lang="ts">
import ExpenseComponent from '@/components/expenses/expenseComponent.vue'
import { useExpensesStore } from '@/stores/expenses'
import ExpenseDetailsDialog from '@/components/expenses/expenseDetailsDialog.vue'
import { onMounted, ref } from 'vue'
import type { ViewExpense } from '@/types/viewExpense'
import { VList } from 'virtua/vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import LoadingIndicator from '@/components/loadingIndicator.vue'
import { DayTotalType } from '@/types/DayTotalType'
import { DateClickedPayloadType } from '@/types/DateClickedPayloadType'
import DayTotalsDialog from '@/components/expenses/dayTotalsDialog.vue'

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
  if (!rootRef.value) return

  const root = rootRef.value
  const [initialize] = useOverlayScrollbars({
    defer: false,
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

const virtualListRef = ref(null)

const isLoadingMore = ref(false)
const handleOnScroll = async (e) => {
  if (!virtualListRef.value) {
    return
  }
  if (isLoadingMore.value) {
    return
  }

  try {
    if (expensesStore.allLoaded) {
      return
    }

    const threshold = 10
    const scrollSize = virtualListRef.value.scrollSize
    const clientHeight = virtualListRef.value.$el.clientHeight

    if (e + clientHeight >= scrollSize - threshold) {
      isLoadingMore.value = true
      await new Promise((resolve) => setTimeout(resolve, 3000)) //TODO: TO BE REMOVED IN FINAL VERSION

      await expensesStore.getExpenses(false, true)
    }
  } catch (error) {
    console.log('loadMoreExpenses', error)
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
  <div class="relative size-full flex-col rounded-2xl bg-neutral-50 p-2 shadow dark:bg-neutral-800">
    <expense-details-dialog
      v-if="showDeleteDialog"
      @close="closeDeleteDialog"
      :expense="selectedExpense"
    />
    <div class="absolute bottom-2 z-99 flex size-8 w-full justify-center" v-if="isLoadingMore">
      <loading-indicator />
    </div>
    <div ref="rootRef" data-overlayscrollbars-initialize="" class="flex h-full">
      <VList
        ref="virtualListRef"
        :data="expensesStore.list"
        :style="{ height: 'none' }"
        class="rounded-2xl"
        #default="{ item, index }"
        @scroll="handleOnScroll"
      >
        <expense-component
          :index="index"
          :date="item.date"
          :unixDate="item.unixDate"
          :value="item.value"
          :currency="item.currency"
          :id="item.id"
          @dateClicked="handleDateClicked"
          @select="handleExpenseSelected(item)"
        />
      </VList>
      <!--      <div ref="skeletonLoaderRef" class="flex h-full flex-1 flex-col gap-y-2 overflow-y-auto">
        <div
          v-for="index in 10"
          :key="index"
          class="h-9 w-full animate-pulse rounded-2xl bg-neutral-500"
        ></div>
      </div>-->
    </div>
  </div>
</template>

<style></style>
