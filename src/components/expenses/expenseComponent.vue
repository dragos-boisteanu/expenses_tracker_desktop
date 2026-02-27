<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/composable/useDayjs'
import { useExpensesStore } from '@/stores/expenses'
import isYesterday from '@/helpers/isYesterday'
import isSameDay from '@/helpers/isSameDay'
import ExpenseDateLineComponent from '@/components/expenses/expenseDateLineComponent.vue'

const props = defineProps({
  value: { type: String, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
  unixDate: { type: Number, required: true },
  id: { type: Number, required: true },
  index: { type: Number, required: true },
})
const dayjs = useDayjs()
const emits = defineEmits(['select'])
const expensesStore = useExpensesStore()

const previousDateLine = computed(() => {
  const nextUnix = getNextDate()
  if (!nextUnix) return ''

  const currentUnix = props.unixDate

  // 1. If same day, don't show a date line
  if (isSameDay(currentUnix, nextUnix)) {
    return ''
  }

  // 2. Check for Yesterday (Relative to now)
  if (isYesterday(nextUnix)) {
    return 'Yesterday'
  }

  // 3. Fallback to Day.js for specific formatting
  // Only create one Day.js object at the very end if needed
  return dayjs.unix(nextUnix).format('DD/MM/YYYY')
})

const currentDateLine = computed<string>((): string => {
  const prevIndex = props.index - 1
  if (prevIndex >= 0) {
    return ''
  }

  let currentDate = ''

  const nowInSeconds = Math.floor(Date.now() / 1000)
  if (isSameDay(props.unixDate, nowInSeconds)) {
    currentDate = 'Today'
  } else {
    currentDate = dayjs(props.unixDate).format('DD/MM/YYYY')
  }

  return currentDate
})

const getNextDate = (): number => {
  let date: number = 0

  const prevItem = expensesStore.list[props.index + 1]
  if (!prevItem) {
    return 0
  }

  date = prevItem.unixDate

  return date
}

const selectExpense = () => {
  emits('select')
}
</script>

<template>
  <expense-date-line-component v-if="currentDateLine" :date="currentDateLine" />
  <div
    @click.prevent="selectExpense"
    class="flex w-full cursor-pointer items-baseline justify-between gap-1.5 rounded-lg p-2 text-sm text-gray-700 hover:bg-neutral-100 hover:text-gray-800 hover:shadow active:bg-neutral-100/60 dark:text-gray-200 dark:hover:bg-neutral-700/50 dark:hover:text-gray-100 dark:active:bg-neutral-700/75"
  >
    <div class="flex items-center gap-x-1">
      <div class="max-w-32 overflow-hidden text-ellipsis">
        {{ props.value }}
      </div>
    </div>
    <div class="h-fit flex-1 border-b border-dashed border-b-gray-800 dark:border-b-gray-500"></div>
    <div>{{ props.date }}</div>
  </div>
  <expense-date-line-component v-if="previousDateLine" :date="previousDateLine" />
</template>

<style scoped></style>
