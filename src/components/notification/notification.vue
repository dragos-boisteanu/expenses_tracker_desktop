<script setup lang="ts">
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  notification: { type: Object, required: true },
})
const emits = defineEmits(['select'])

const selectNotification = () => {
  emits('select', props.notification)
}
</script>

<template>
  <div
    @click="selectNotification"
    class="flex cursor-pointer items-center gap-x-2 rounded-lg p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
  >
    <div class="icon min-h-9 min-w-9">
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
          'font-medium dark:!text-neutral-200': props.notification.isNew,
        }"
      >
        {{ props.notification.content }}
      </div>
      <div
        class="text-xs text-indigo-600 dark:text-indigo-500"
        :class="{
          'font-medium dark:!text-indigo-400': props.notification.isNew,
        }"
      >
        {{ props.notification.formattedCreatedAt }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
