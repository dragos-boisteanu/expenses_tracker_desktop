<script setup lang="ts">
import { ref } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import DialogComponent from '@/components/dialogComponent.vue'
import { useThemeStore } from '@/stores/theme'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'dateUpdated', value: number): void
}>()

const props = withDefaults(
  defineProps<{ date: number; pickerMode?: 'calendar' | 'time' | 'both' }>(),
  {
    pickerMode: 'both',
  },
)

const tempDate = ref<number | null>(props.date ? props.date * 1000 : null)

const isDarkTheme = ref<boolean>(false)

const isTimeOnly = props.pickerMode === 'time'
const timeConfig = {
  enableTimePicker: props.pickerMode === 'both',
}

const themeStore = useThemeStore()
isDarkTheme.value = themeStore.theme === 'dark'

const handleDateSelected = (date: number): void => {
  emits('dateUpdated', Math.floor(date / 1000))
}
</script>

<template>
  <dialog-component :datepicker="true" @close="emits('close')" :hideCloseButton="true">
    <template #default>
      <VueDatePicker
        v-model="tempDate"
        :time-picker="isTimeOnly"
        :time-config="timeConfig"
        model-type="timestamp"
        :dark="isDarkTheme"
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
