import type { InjectionKey } from 'vue'
import type dayjsType from 'dayjs'

export const DayjsKey: InjectionKey<typeof dayjsType> = Symbol('Dayjs')
