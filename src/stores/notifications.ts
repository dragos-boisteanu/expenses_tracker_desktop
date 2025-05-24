import { defineStore } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import { ViewNotification } from '@/types/viewNotification'

export const useNotificationStore = defineStore('notifications', () => {
  const list = ref<ViewNotification[]>([])

  const setNotifications = (notifications: ViewNotification[]) => {
    list.value = notifications
  }

  const addNotification = (notification: ViewNotification) => list.value.unshift(notification)

  const markAsRead = (id: number) => {
    const notificationIndex = list.value.findIndex((n) => n.id === id)

    if (notificationIndex > -1) {
      list.value[notificationIndex].isNew = false
    }
  }

  const markUnread = (id: number) => {
    const notificationIndex = list.value.findIndex((n) => n.id === id)
    if (notificationIndex > -1) {
      list.value[notificationIndex].isNew = true
    }
  }

  const markAllAsRead = () => {
    for (const notification of list.value) {
      notification.isNew = false
    }
  }

  const newCount: ComputedRef<string | number> = computed(() => {
    let newCount: number | string = list.value.filter((notification) => notification.isNew).length

    if (newCount > 9) {
      newCount = '9+'
    }

    return newCount
  })

  const count: ComputedRef<number> = computed(() => {
    return list.value.length
  })

  return {
    list,
    count,
    newCount,
    setNotifications,
    addNotification,
    markAsRead,
    markUnread,
    markAllAsRead,
  }
})
