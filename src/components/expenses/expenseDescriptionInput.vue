<script setup lang="ts">
import { ref, computed } from 'vue'
import type { JSONContent } from '@tiptap/vue-3'
import DialogComponent from '@/components/dialogComponent.vue'
import CancelButtonComponent from '@/components/buttons/cancelButtonComponent.vue'
import TiptapEditor from '@/components/TiptapEditor.vue'
import { useDayjs } from '@/composable/useDayjs' // Adjust path to where you saved it
import CalendarDaysIcon from '@heroicons/vue/16/solid/CalendarDaysIcon'
import ClockIcon from '@heroicons/vue/16/solid/ClockIcon'
import DateAndTimePicker from '@/components/dateAndTimePicker.vue'
import { DescriptionAndDateType } from '@/types/descriptionAndDateType'
import GeneralButtonComponent from '@/components/buttons/generalButtonComponent.vue'

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

const pickerMode = ref<'both' | 'calendar' | 'time'>('both')

const showDatepickerDialog = ref<boolean>(false)
const toggleDatepickerDialog = (picker: 'both' | 'calendar' | 'time' = 'both') => {
  showDatepickerDialog.value = !showDatepickerDialog.value
  pickerMode.value = picker
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
        :pickerMode="pickerMode"
        :date="date"
      />
    </template>
    <!--    <template #title> Add a description & date </template>-->

    <template #default>
      <div class="w-full pt-4">
        <div class="font-semibold text-neutral-800 dark:text-neutral-300">Date & Time</div>
        <div
          class="mt-1 flex cursor-pointer items-center divide-x divide-indigo-100
            dark:divide-indigo-500/20 justify-between rounded-2xl shadow outline-0"
        >
          <button
            class="group flex flex-1 items-center justify-center gap-x-2 px-6 py-3 bg-indigo-50/80
              dark:bg-indigo-400/10 rounded-l-2xl hover:dark:bg-indigo-400/20 cursor-pointer
              hover:bg-indigo-100 active:dark:bg-indigo-600/40 transition-all duration-150
              active:bg-indigo-200 active:inset-shadow-md"
            @click="toggleDatepickerDialog('calendar')"
          >
            <CalendarDaysIcon
              class="size-6 justify-center text-indigo-600 dark:text-indigo-400
                group-hover:text-indigo-500 group-hover:dark:text-indigo-300
                group-active:dark:text-indigo-400 group-active:text-indigo-800"
            />
            <span
              class="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500
                group-hover:dark:text-indigo-300 group-active:dark:text-indigo-400
                group-active:text-indigo-800"
            >
              {{ formattedDate }}
            </span>
          </button>

          <button
            class="group flex flex-1 items-center justify-center gap-x-2 px-6 py-3 bg-indigo-50/80
              dark:bg-indigo-400/10 rounded-r-2xl hover:dark:bg-indigo-400/20 cursor-pointer
              hover:bg-indigo-100 active:dark:bg-indigo-600/40 transition-all duration-150
              active:bg-indigo-200 active:inset-shadow-md"
            @click="toggleDatepickerDialog('time')"
          >
            <ClockIcon
              class="size-6 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500
                group-hover:dark:text-indigo-300 group-active:dark:text-indigo-400
                group-active:text-indigo-800"
            />

            <span
              class="text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500
                group-hover:dark:text-indigo-300 group-active:dark:text-indigo-400
                group-active:text-indigo-800"
            >
              {{ formattedTime }}
            </span>
          </button>
        </div>

        <div class="mt-4">
          <div class="font-semibold text-neutral-800 dark:text-neutral-300">Description</div>
          <div
            class="mt-1 h-64 overflow-x-hidden rounded-2xl bg-neutral-50 shadow dark:bg-neutral-900"
          >
            <TiptapEditor v-model="descriptionContent" />
          </div>
        </div>
      </div>
    </template>

    <template #actions>
      <cancel-button-component @click="close()"> Cancel </cancel-button-component>
      <general-button-component @click="add()"> Save </general-button-component>
    </template>
  </dialog-component>
</template>
