<script setup lang="ts">
import { ref } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import DialogComponent from '@/components/dialogComponent.vue'
import { useThemeStore } from '@/stores/theme'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'

const emits = defineEmits<{
  (e: 'close'): void
}>()

const date = ref(null)
const isDarkTheme = ref<boolean>(false)

const themeStore = useThemeStore()
isDarkTheme.value = themeStore.theme === 'dark'

const handleDateSelected = (date: any): void => {
  console.log('handleDateSelected', date)
}
</script>

<template>
  <dialog-component @close="emits('close')" :hideCloseButton="true">
    <template #default>
      <VueDatePicker
        :value="date"
        model-type="timestamp"
        :dark="isDarkTheme"
        :flow="{ steps: ['calendar', 'time'] }"
        inline
        @update:model-value="handleDateSelected"
        placeholder="Select date and time..."
      >
        <template #action-row="{ selectDate }">
          <div class="flex w-full items-center justify-end gap-x-4">
            <cancel-button-component @click="emits('close')">Cancel</cancel-button-component>
            <confirm-button-component @click="selectDate">Save</confirm-button-component>
          </div>
        </template>
      </VueDatePicker>
    </template>
  </dialog-component>
</template>

<style scoped></style>
