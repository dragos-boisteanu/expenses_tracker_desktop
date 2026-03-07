<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/composable/useDayjs'
import { useExpensesStore } from '@/stores/expenses'
import isYesterday from '@/helpers/isYesterday'
import isSameDay from '@/helpers/isSameDay'
import ExpenseDateLineComponent from '@/components/expenses/expenseDateLineComponent.vue'
import { useTimeStore } from '@/stores/time'

const props = defineProps({
  value: { type: String, required: true },
  currency: { type: String, required: false, default: 'RON' },
  date: { type: String, required: true },
  unixDate: { type: Number, required: true },
  id: { type: Number, required: true },
  index: { type: Number, required: true },
})

const dayjs = useDayjs()
const timeStore = useTimeStore()
const emits = defineEmits(['select', 'dateClicked'])
const expensesStore = useExpensesStore()


const currentDateLine = computed<string>((): string => {
  const nextUnix = getPreviousDate()
  const currentUnix = props.unixDate

  if (nextUnix > 0 && isSameDay(currentUnix, nextUnix)) {
    return ''
  }

  let currentDate = ''

  const nowInSeconds = Math.floor(timeStore.now / 1000)

  if (isSameDay(currentUnix, nowInSeconds)) {
    currentDate = 'Today'
  } else if (isYesterday(currentUnix)) {
    currentDate = 'Yesterday'
  } else {
    currentDate = dayjs.unix(currentUnix).format('DD/MM/YYYY')
  }

  return currentDate
})

const getPreviousDate = (): number => {
  let date: number = 0

  const prevItem = expensesStore.list[props.index - 1]
  if (!prevItem) {
    return 0
  }

  date = prevItem.unixDate

  return date
}

const selectExpense = () => {
  emits('select')
}

const dateClickedHandler = () => {
  emits('dateClicked', {date:  props.unixDate, formattedDate: currentDateLine.value})
}
</script>

<template>
  <expense-date-line-component
    v-if="currentDateLine"
    :date="currentDateLine"
    @date-clicked="dateClickedHandler()"
  />
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
</template>

<style scoped></style>
