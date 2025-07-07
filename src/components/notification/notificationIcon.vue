<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications'
import BadgeComponent from '@/components/badgeComponent.vue'
import { BellIcon } from '@heroicons/vue/24/outline'
import NotificationsDialogComponent from '@/components/notification/notificationsDialogComponent.vue'
import { ref } from 'vue'

const notificationsStore = useNotificationStore()
const show = ref<boolean>(false)
const toggleNotificationDialog = () => {
  show.value = !show.value
}

// TODO: dialog for notifications list
</script>

<template>
  <div class="relative cursor-pointer" @click="toggleNotificationDialog">
    <badge-component :count="notificationsStore.newCount">
      <BellIcon
        class="size-5 text-neutral-800 hover:text-neutral-600 active:text-neutral-900 dark:text-neutral-300 hover:dark:text-neutral-50 active:dark:text-neutral-400"
      />
    </badge-component>
    <notifications-dialog-component v-if="show" @close="toggleNotificationDialog" />
  </div>
</template>

<style scoped></style>
