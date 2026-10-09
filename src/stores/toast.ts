import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToastType } from '@/types/ToastType'

const MAX_TOASTS: number = 1
const DEFAULT_DURATION: number = 3000

export const useToastStore = defineStore('toasts', () => {
  const list = ref<ToastType[]>([])

  const add = (payload: ToastType) => {
    payload.id = list.value.length + 1
    payload.duration = DEFAULT_DURATION

    if (list.value.length < MAX_TOASTS) {
      console.log()
      list.value.unshift(payload)
    } else {
      setTimeout(() => {
        list.value.splice(list.value.length - 1, 1)

        setTimeout(() => {
          list.value.unshift(payload)
        }, DEFAULT_DURATION / 3)
      }, DEFAULT_DURATION / 2)
    }
  }
  const remove = (id: number) => {
    const index = list.value.findIndex((entry) => entry.id === id)

    if (index > -1) {
      list.value.splice(index, 1)
    }
  }

  return {
    list,
    add,
    remove,
  }
})
