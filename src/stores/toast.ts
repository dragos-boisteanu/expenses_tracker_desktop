import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ToastType } from '@/types/ToastType'

export const useToastStore = defineStore('notifier', () => {
  const list = ref<ToastType[]>([])
  const add = (payload: ToastType) => {
    list.value.push(payload)
  }
  const remove = (id: string) => {
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
