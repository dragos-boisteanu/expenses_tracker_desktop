<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const setTheme = () => {
  if (themeStore.theme === 'dark') {
    themeStore.setTheme('light')
  } else {
    themeStore.setTheme('dark')
  }
}
</script>

<template>
  <button @click="setTheme" class="group size-5 cursor-pointer">
    <MoonIcon
      v-if="themeStore.theme === 'dark'"
      class="size-fit text-indigo-500 group-hover:text-indigo-300 group-active:text-indigo-600"
    />

    <SunIcon
      v-else
      class="size-fit text-neutral-800 group-hover:text-neutral-600 group-active:text-neutral-900"
    />
  </button>
</template>

<style scoped></style>
