<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
import TogglerComponent from '@/components/togglerComponent.vue'
import { ref } from 'vue'

const themeStore = useThemeStore()

const isDarkTheme = ref<boolean>(false)
isDarkTheme.value = themeStore.theme === 'dark'
const setTheme = () => {
  let theme: string
  if (themeStore.theme === 'dark') {
    theme = 'light'
  } else {
    theme = 'dark'
  }

  themeStore.setTheme(theme, true)
}
</script>

<template>
  <div class="flex items-center justify-between gap-x-2">
    <div>
      <div class="font-semibold">Theme</div>
      <div class="text-xs text-neutral-500 dark:text-neutral-400">
        Toggle between <b>light</b> and <b>dark</b> themes
      </div>
    </div>
    <toggler-component v-model="isDarkTheme" @changed="setTheme" />
  </div>
</template>

<style scoped></style>
