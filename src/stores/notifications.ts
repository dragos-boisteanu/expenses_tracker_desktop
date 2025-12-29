import { defineStore } from 'pinia'
import { computed, type ComputedRef, ref } from 'vue'
import type { ViewNotification } from '@/types/viewNotification'
import dayjs from '@/plugins/dayjs'
import NotificationsDB from '@/repositories/NotificationDB'
import type { Notification } from '@/types/notification'
import type { AddNotificationType } from '@/types/addNotificationType'

export const useNotificationStore = defineStore('notifications', () => {
  const list = ref<ViewNotification[]>([])

  const limit = 5
  let offset = 0
  let allLoaded = false

  const addNotification = async (payload: AddNotificationType): Promise<void> => {
    try {
      const notificationDate = dayjs()
      const unixDate = notificationDate.unix()

      const notification: Notification = {
        title: payload.title,
        content: payload.content,
        type: payload.type,
        read: payload.isNew ? 0 : 1,
        isError: payload.isError,
        createdAt: unixDate,
      }

      const notificationDb = NotificationsDB.instance
      const id: number = await notificationDb.addNotification(notification)

      list.value.unshift({
        id,
        title: notification.title,
        content: notification.content,
        type: notification.type,
        isNew: payload.isNew,
        isError: notification.isError,
        createdAt: notification.createdAt,
        formattedCreatedAt: dayjs(notification.createdAt).format('MM/DD/YYYY HH:mm').toString(),
      })
    } catch (error) {
      throw error
    }
  }

  const getNotifications = async (nextPage: boolean = false): Promise<boolean> => {
    try {
      if (allLoaded) {
        return true
      }

      const notificationsDB = NotificationsDB.instance

      const notifications = await notificationsDB.getNotifications(offset, limit)
      const viewNotifications: ViewNotification[] = notifications.map(
        (notification: Notification): ViewNotification => {
          return {
            id: Number(notification.id),
            title: notification.title,
            content: notification.content,
            type: notification.type,
            isNew: notification.read === 0,
            isError: notification.isError,
            createdAt: notification.createdAt,
            formattedCreatedAt: dayjs(notification.createdAt).format('MM/DD/YYYY HH:mm').toString(),
          }
        },
      )

      if (nextPage) {
        list.value.push(...viewNotifications)
      } else {
        list.value = notifications
      }

      if (notifications.length < limit) {
        allLoaded = true
      } else {
        offset += limit
      }

      return allLoaded
    } catch (error) {
      throw error
    }
  }

  const markAsRead = async (id: number) => {
    try {

      const notificationIndex = list.value.findIndex((n) => n.id === id)
      if (notificationIndex > -1) {
        if (list.value[notificationIndex]) {
          const notificationDb = NotificationsDB.instance
          await notificationDb.markNotificationAsRead(id)

          list.value[notificationIndex].isNew = false
        }
      }
    } catch (error) {
      throw error
    }
  }

  const markAllAsRead = async () => {
    try {
      const notificationDb = NotificationsDB.instance
      await notificationDb.markAllNotificationsAsRead()

      for (const notification of list.value) {
        notification.isNew = false
      }
    } catch (error) {
      throw error
    }
  }

  // const addOlderNotifications = (notifications: ViewNotification[]) => {
  //   list.value.push(...notifications)
  // }

  const markUnread = (id: number) => {
    const notificationIndex = list.value.findIndex((n) => n.id === id)
    if (notificationIndex > -1) {
      if (list.value[notificationIndex]) {
        list.value[notificationIndex].isNew = true
      }
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
    addNotification,
    getNotifications,
    markAsRead,
    markUnread,
    markAllAsRead,
  }
})
