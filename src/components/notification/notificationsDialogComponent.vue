<script setup lang="ts">
import { VList } from 'virtua/vue'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import { useNotificationStore } from '@/stores/notifications'
import Notification from '@/components/notification/notification.vue'
import DialogComponent from '@/components/dialogComponent.vue'
import { ViewNotification } from '@/types/viewNotification'
import LoadingIndicator from '@/components/loadingIndicator.vue'

const notificationsStore = useNotificationStore()

const emits = defineEmits(['markAllAsRead', 'close'])

const handleNotificationSelected = (notification: ViewNotification) => {
  if (notification.isNew) {
    notificationsStore.markAsRead(notification.id as number)
  }

  if (notification.type === 'update') {
    console.log('updateNotification', notification)
  }
}

const isLoadingMarkAllAsRead = ref<boolean>(false)
const markAllAsRead = async () => {
  try {
    isLoadingMarkAllAsRead.value = true
    await notificationsStore.markAllAsRead()
  } catch (error) {
    console.error('error', error)
  } finally {
    isLoadingMarkAllAsRead.value = false
  }
}

const rootRef = ref<HTMLDivElement | null>(null)
watch(
  () => notificationsStore.count,
  async (value) => {
    await nextTick()

    if (value < 5) {
      rootRef.value.style.height = `${value * 68}px`
    } else {
      rootRef.value.style.height = '224px'
    }
  },
  { immediate: true },
)
onMounted(() => {
  const root = rootRef.value

  const [initialize] = useOverlayScrollbars({
    defer: false,
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

const virtualListRef = ref(null)
const isLoadingMore = ref(false)
const allLoaded = ref(false)
const handleOnScroll = async (e) => {
  try {
    if (allLoaded.value) {
      return
    }

    const threshold = 10
    const scrollSize = virtualListRef.value.scrollSize
    const clientHeight = virtualListRef.value.$el.clientHeight

    if (e + clientHeight >= scrollSize - threshold) {
      isLoadingMore.value = true
      await new Promise((resolve) => setTimeout(resolve, 3000)) //TODO: TO BE REMOVED IN FINAL VERSION
      allLoaded.value = await notificationsStore.getNotifications(true)
    }
  } catch (error) {
    console.error('loadMoreNotifications', error)
  } finally {
    isLoadingMore.value = false
  }
}

const close = () => emits('close')
</script>

<template>
  <dialog-component @close="close">
    <template #title>Notifications</template>
    <div class="relative h-full overflow-hidden rounded-lg">
      <div class="absolute bottom-2 z-99 flex size-6 w-full justify-center" v-if="isLoadingMore">
        <loading-indicator />
      </div>
      <div ref="rootRef" data-overlayscrollbars-initialize="">
        <VList
          ref="virtualListRef"
          :data="notificationsStore.list"
          :style="{ height: 'none' }"
          #default="{ item }"
          @scroll="handleOnScroll"
        >
          <notification :notification="item" @select="handleNotificationSelected" />
        </VList>
      </div>
    </div>
    <template #actions>
      <button
        class="cursor-pointer rounded-lg p-2 text-xs text-neutral-800 hover:text-neutral-700 active:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-200 dark:active:text-neutral-400"
        @click="markAllAsRead"
      >
        Mark all read

        <span v-if="isLoadingMarkAllAsRead"> loading </span>
      </button>
    </template>
  </dialog-component>
</template>

<style scoped></style>
