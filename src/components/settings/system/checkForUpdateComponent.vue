<script setup lang="ts">
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'
import { ref } from 'vue'
import { useAutoUpdateStore } from '@/stores/autoUpdate'

const updateStore = useAutoUpdateStore()

const checkingForUpdate = ref<boolean>(false)
const checkForUpdate = async () => {
  try {
    checkingForUpdate.value = true

    await window['app'].checkForUpdate()
  } catch (error) {
    console.error('checkForUpdate', error)
  } finally {
    checkingForUpdate.value = false
  }
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
    <general-button-component
      :is-disabled="updateStore.isUpdateDownloaded"
      :is-loading="checkingForUpdate"
      @click="checkForUpdate"
    >
      Check
    </general-button-component>
  </div>
</template>

<style scoped></style>
