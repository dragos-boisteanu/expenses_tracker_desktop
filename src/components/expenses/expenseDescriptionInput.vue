<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JSONContent } from '@tiptap/vue-3'
import DialogComponent from '@/components/dialogComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import ConfirmButtonComponent from '@/components/buttons/confirmButtonComponent.vue'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { useDayjs } from '@/composable/useDayjs' // Adjust path to where you saved it
import CalendarDaysIcon from '@heroicons/vue/16/solid/CalendarDaysIcon'
import ClockIcon from '@heroicons/vue/16/solid/ClockIcon'
import DateAndTimePicker from '@/components/dateAndTimePicker.vue'
import { DescriptionAndDateType } from '@/types/descriptionAndDateType'

// If you want to open this dialog to EDIT existing content, accept it as a prop
const props = defineProps<{
  initialContent?: JSONContent
}>()

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'add', payload: DescriptionAndDateType): void
}>()

// Initialize with props.initialContent if editing, otherwise it starts empty
const descriptionContent = ref<JSONContent | null>(props.initialContent || null)

const close = () => emits('close')

const add = () => {
  if (!descriptionContent.value) {
    emits('add', {
      date: date.value,
    })
    return
  }
  emits('add', {
    description: descriptionContent.value,
    date: date.value,
  })
}

const date = ref<number>()
const formattedDate = computed(() => dayjs.unix(date.value).format('DD/MM/YYYY'))
const formattedTime = computed(() => dayjs.unix(date.value).format('HH:mm'))
const dayjs = useDayjs()

date.value = dayjs().unix()

//TODO: dedicated time and date picker based on where the user clicks
const showDatepickerDialog = ref<boolean>(false)
const toggleDatepickerDialog = () => {
  showDatepickerDialog.value = !showDatepickerDialog.value
}

const handleDateUpdated = (newDate: number): void => {
  date.value = newDate
  toggleDatepickerDialog()
}
</script>

<template>
  <dialog-component :no-title="true" :hide-close-button="true">
    <template #dialog v-if="showDatepickerDialog">
      <date-and-time-picker
        @close="toggleDatepickerDialog"
        @dateUpdated="handleDateUpdated"
        :date="date"
      />
    </template>
    <!--    <template #title> Add a description & date </template>-->

    <template #default>
      <div class="w-full pt-4">
        <div class="font-semibold text-neutral-800 dark:text-neutral-300">Date & Time</div>
        <div
          class="mt-1 flex cursor-pointer items-center justify-between rounded-2xl bg-neutral-50 p-3 px-6 shadow outline-0 dark:bg-neutral-900"
          @click="toggleDatepickerDialog"
        >
          <div class="flex items-center gap-x-2">
            <button class="pointer-events-none">
              <CalendarDaysIcon class="size-6 text-neutral-800 dark:text-neutral-300" />
            </button>
            <div class="text-neutral-800 dark:text-neutral-300">
              {{ formattedDate }}
            </div>
          </div>

          <div class="flex items-center gap-x-2">
            <button class="pointer-events-none">
              <ClockIcon class="size-6 text-neutral-800 dark:text-neutral-300" />
            </button>
            <div class="text-neutral-800 dark:text-neutral-300">
              {{ formattedTime }}
            </div>
          </div>
        </div>

        <div class="mt-4">
          <div class="font-semibold text-neutral-800 dark:text-neutral-300">Description</div>
          <div
            class="mt-1 h-64 overflow-x-hidden rounded-2xl bg-neutral-50 shadow dark:bg-neutral-900"
          >
            <TiptapEditor v-model="descriptionContent" />
          </div>
        </div>

        <!-- Reusable Editor Component using v-model -->
      </div>
    </template>

    <template #actions>
      <cancel-button-component @click="close()"> Cancel </cancel-button-component>
      <confirm-button-component @click="add()"> Save </confirm-button-component>
    </template>
  </dialog-component>
</template>
