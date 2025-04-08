<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/composable/useDayjs.ts'
import { useTimeStore } from '@/stores/time.ts'
const props = defineProps({
  value: { type: String, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
  previousDate: { type: String, required: false, default: '' },
})
const dayjs = useDayjs()
const timeStore = useTimeStore()

const dayLimiter = computed<string>((): string => {
  if (!props.previousDate) {
    return ''
  }

  let dayLimiter = ''

  const previousExpenseDate = dayjs(props.previousDate, 'DD/MM/YY HH:mm')
  const yesterday = dayjs(timeStore.now)
  const expenseDate = dayjs(props.date, 'DD/MM/YY HH:mm')

  if (
    previousExpenseDate &&
    !expenseDate.startOf('day').isSame(previousExpenseDate.startOf('day'))
  ) {
    const yesterdayStartOfDay = yesterday.startOf('day')
    const previousExpenseDateStartOfDay = previousExpenseDate.startOf('day')

    if (previousExpenseDateStartOfDay.isSame(yesterdayStartOfDay)) {
      dayLimiter = 'Yesterday'
    } else if (previousExpenseDateStartOfDay.isBefore(yesterdayStartOfDay)) {
      dayLimiter = `${previousExpenseDate.format('DD/MM/YYYY')}`
    }
  }

  return dayLimiter
})
</script>

<template>
  <div>
    <div
      class="mt-1 flex w-full cursor-pointer items-baseline justify-between gap-1.5 rounded-lg p-2 text-sm text-gray-700 hover:bg-neutral-100"
    >
      <div class="flex items-center gap-x-1">
        <div class="max-w-20 overflow-hidden text-ellipsis">
          {{ props.value }}
        </div>
        <div>
          {{ props.currency }}
        </div>
      </div>
      <div class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800"></div>
      <div>{{ props.date }}</div>
    </div>
    <div
      v-if="dayLimiter"
      class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600"
    >
      <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
      <div>{{ dayLimiter }}</div>
      <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
    </div>
  </div>
</template>

<style scoped></style>
