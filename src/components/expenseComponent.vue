<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/composable/useDayjs'
import { useTimeStore } from '@/stores/time'

const props = defineProps({
  value: { type: String, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
  previousDate: { type: String, required: false, default: '' },
})
const dayjs = useDayjs()
const timeStore = useTimeStore()
const emits = defineEmits(['select'])

const dayLimiter = computed<string>((): string => {
  if (!props.previousDate) {
    return ''
  }

  let dayLimiter = ''

  const previousExpenseDate = dayjs(props.previousDate, 'DD/MM/YY HH:mm')
  const expenseDate = dayjs(props.date, 'DD/MM/YY HH:mm')

  if (
    previousExpenseDate &&
    !expenseDate.startOf('day').isSame(previousExpenseDate.startOf('day'))
  ) {
    const yesterday = dayjs(timeStore.now).subtract(1, 'day').startOf('day')
    const previousExpenseDateStartOfDay = previousExpenseDate.startOf('day')

    if (previousExpenseDateStartOfDay.isSame(yesterday)) {
      dayLimiter = 'Yesterday'
    } else if (previousExpenseDateStartOfDay.isBefore(yesterday)) {
      dayLimiter = `${previousExpenseDate.format('DD/MM/YYYY')}`
    }
  }

  return dayLimiter
})

const selectExpense = () => {
  emits('select')
}
</script>

<template>
  <div>
    <div
      @click.prevent="selectExpense"
      class="flex w-full cursor-pointer items-baseline justify-between gap-1.5 rounded-lg p-2 text-sm text-gray-700 hover:bg-neutral-100 hover:text-gray-800 hover:shadow active:bg-neutral-100/60 dark:text-gray-200 dark:hover:bg-neutral-700/50 dark:hover:text-gray-100 dark:active:bg-neutral-700/75"
    >
      <div class="flex items-center gap-x-1">
        <div class="max-w-20 overflow-hidden text-ellipsis">
          {{ props.value }}
        </div>
        <div>
          {{ props.currency }}
        </div>
      </div>
      <div
        class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800 dark:border-b-gray-500"
      ></div>
      <div>{{ props.date }}</div>
    </div>
    <div
      v-if="dayLimiter"
      class="flex w-full items-center justify-between gap-1.5 py-2 text-xs text-indigo-600 dark:text-indigo-500"
    >
      <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600 dark:border-b-indigo-500"></div>
      <div>{{ dayLimiter }}</div>
      <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600 dark:border-b-indigo-500"></div>
    </div>
  </div>
</template>

<style scoped></style>
