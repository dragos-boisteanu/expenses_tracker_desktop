import { Dayjs } from 'dayjs'

const formatDate = (expenseDate: Dayjs, previousExpenseDate: Dayjs, yesterday: Dayjs) => {
  let showDayLimiter = false
  let dayLimiterText = ''

  if (
    previousExpenseDate &&
    !expenseDate.startOf('day').isSame(previousExpenseDate.startOf('day'))
  ) {
    const yesterdayStartOfDay = yesterday.startOf('day')
    const previousExpenseDateStartOfDay = previousExpenseDate.startOf('day')

    if (previousExpenseDateStartOfDay.isSame(yesterdayStartOfDay)) {
      showDayLimiter = true
      dayLimiterText = 'Yesterday'
    } else if (previousExpenseDateStartOfDay.isBefore(yesterdayStartOfDay)) {
      showDayLimiter = true
      dayLimiterText = `${previousExpenseDate.format('DD/MM/YYYY')}`
    }
  }

  return { showDayLimiter, dayLimiterText }
}

export default formatDate
