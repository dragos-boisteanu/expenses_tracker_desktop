<script setup lang="ts">
import { VList } from 'virtua/vue'
import { inject, onMounted, ref, watch } from 'vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import { useNotificationStore } from '@/stores/notifications'
import Notification from '@/components/notification/notification.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import { ViewNotification } from '@/types/viewNotification'
import { NotificationService } from '@/services/notificationService'

const notificationService = inject('notificationService') as NotificationService
const notificationsStore = useNotificationStore()

const emits = defineEmits(['markAllAsRead', 'close'])

const handleNotificationSelected = (notification: ViewNotification) => {
  if (notification.isNew) {
    notificationService.markAsRead(notification.id)
  }
}

const isLoadingMarkAllAsRead = ref<boolean>(false)
const markAllAsRead = async () => {
  try {
    isLoadingMarkAllAsRead.value = true
    await notificationService.markAllAsRead()
  } catch (error) {
    console.error('error', error)
  } finally {
    isLoadingMarkAllAsRead.value = false
  }
}

const rootRef = ref<HTMLDivElement | null>(null)
watch(
  () => notificationsStore.count,
  (value) => {
    if (value < 5) {
      rootRef.value.style.height = `${value * 68}px`
    } else {
      rootRef.value.style.height = '224px'
    }
  },
)
onMounted(() => {
  const root = rootRef.value

  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        visibility: 'visible',
      },
      overflow: {
        x: 'hidden',
        y: 'scroll',
      },
    },
  })

  initialize({
    target: root,
    elements: {
      viewport: root.firstElementChild as HTMLElement,
    },
  })
})

const close = () => emits('close')
</script>

<template>
  <dialog-component @close="close">
    <template #title>Notifications</template>
    <div class="overflow-hidden rounded-lg">
      <div ref="rootRef" data-overlayscrollbars-initialize="">
        <VList :data="notificationsStore.list" :style="{ height: 'none' }" #default="{ item }">
          <notification :notification="item" @select="handleNotificationSelected" />
        </VList>
      </div>
    </div>
    <template #actions>
      <button
        class="cursor-pointer rounded-lg p-2 text-xs text-neutral-800 hover:text-neutral-700 active:text-neutral-900"
        @click="markAllAsRead"
      >
        Mark all read

        <span v-if="isLoadingMarkAllAsRead"> loading </span>
      </button>
    </template>
  </dialog-component>
</template>

<style scoped></style>
