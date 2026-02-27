import { useDayjs } from '@/composable/useDayjs'
const dayjs = useDayjs()


export default (value: string) => {
  const date = dayjs(value)
  const now = dayjs()
  const yesterday = dayjs().subtract(1, 'days')


/*
if(date.isToday()) {
  return 'Today at'
}
*/

}
