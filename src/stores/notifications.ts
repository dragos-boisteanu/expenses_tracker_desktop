import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Notification } from '@/types/notification'
import { ViewNotification } from '@/types/viewNotification'

export const useNotificationStore = defineStore('notifications', () => {
  const list = ref<Notification[]>([])

  const addNotification = (notification: ViewNotification) => list.value.unshift(notification)
  const markAsRead = (id: number) => {
    const notificationIndex = list.value.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      list.value[notificationIndex].read = true
    }
  }
  const markUnread = (id: number) => {
    const notificationIndex = list.value.findIndex((n) => n.id === id)
    if (notificationIndex === -1) {
      list.value[notificationIndex].read = false
    }
  }
  const markAllAsRead = () => {
    for (const notification of list.value) {
      notification.read = true
    }
  }

  return {
    list,
    addNotification,
    markAsRead,
    markUnread,
    markAllAsRead,
  }
})
