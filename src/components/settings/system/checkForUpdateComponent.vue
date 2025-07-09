<script setup lang="ts">
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { ref } from 'vue'

const checkingForUpdate = ref<boolean>(false)
const checkForUpdate = async () => {
  checkingForUpdate.value = true

  await new Promise((resolve) => setTimeout(resolve, 2000))

  checkingForUpdate.value = false
}
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <div>
      <div class="font-semibold">Check for updates</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Check and download new updates
      </div>
    </div>
    <general-button-component :is-loading="checkingForUpdate" @click="checkForUpdate">
      Check
    </general-button-component>
  </div>
</template>

<style scoped></style>
