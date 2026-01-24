<script setup lang="ts">
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import dayjs from 'dayjs'
import { useTimeStore } from '@/stores/time'
import NotificationPlaceholder from '@/components/notification/notificationPlaceholder.vue'
import { ViewNotification } from '@/types/viewNotification'

interface PropsType {
  notification: ViewNotification
  placeholder?: boolean
}

const props = withDefaults(defineProps<PropsType>(), {
  placeholder: false
})
const emits = defineEmits(['select'])
const timeStore = useTimeStore()

const selectNotification = () => {
  emits('select', props.notification)
}

const formattedCreatedAt = computed(() => {
  let formattedDate = ''

  const notificationDate = dayjs.unix(props.notification.createdAt)
  const now = dayjs(timeStore.now)
  const yesterday = dayjs(now).subtract(1, 'day').startOf('day')

  if (notificationDate.startOf('day').isSame(yesterday)) {
    formattedDate = `Yesterday at ${notificationDate.format('HH:mm')}`
  } else if (notificationDate.startOf('day').isBefore(yesterday)) {
    formattedDate = `${notificationDate.format('DD/MM/YYYY HH:mm')}`
  } else {
    formattedDate = notificationDate.fromNow()
  }

  return formattedDate
})
</script>

<template>
  <notification-placeholder v-if="placeholder" />
  <div
    v-else
    @click="selectNotification"
    class="flex cursor-pointer items-center gap-x-2 rounded-lg p-2 text-gray-700 hover:bg-neutral-100 hover:text-gray-800 hover:shadow active:bg-neutral-100/60 dark:text-gray-200 dark:hover:bg-neutral-700/50 dark:hover:text-gray-100 dark:active:bg-neutral-700/75"
  >
    <div class="icon size-9">
      <ExclamationCircleIcon
        v-if="notification.isError"
        class="text-red-600"
        :class="{ '!text-red-500': props.notification.isNew }"
      />
      <CheckIcon
        v-else
        class="text-green-500"
        :class="{ '!text-green-400': props.notification.isNew }"
      />
    </div>
    <div>
      <div
        class="overflow-hidden text-nowrap text-ellipsis whitespace-nowrap text-neutral-900 dark:text-neutral-300"
        :class="{
          'font-medium dark:!text-neutral-100': props.notification.isNew,
        }"
      >
        {{ props.notification.title }}
      </div>
      <div
        class="text-xs text-neutral-600 dark:text-neutral-400"
        :class="{
          'font-medium text-neutral-800 dark:!text-neutral-200': props.notification.isNew,
        }"
      >
        {{ props.notification.content }}
      </div>
      <div
        class="text-xs text-indigo-600 dark:text-indigo-500"
        :class="{
          'font-medium text-indigo-500 dark:!text-indigo-400': props.notification.isNew,
        }"
      >
        {{ formattedCreatedAt }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
