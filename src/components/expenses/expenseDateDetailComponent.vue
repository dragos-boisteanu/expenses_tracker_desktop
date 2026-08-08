<script setup lang="ts">
import { computed, ref } from 'vue'
import dayjs from '@/plugins/dayjs'
import Datepicker from '@/components/datepicker.vue'
import { PencilIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  unixDate: number
}>()

const formatedDate = computed(() => dayjs.unix(props.unixDate).format('DD/MM/YYYY HH:mm'))

const showDatepickerDialog = ref<boolean>(false)
const toggleDatepickerDialog = () => {
  showDatepickerDialog.value = !showDatepickerDialog.value
}
</script>

<template>
  <datepicker v-if="showDatepickerDialog" @close="toggleDatepickerDialog" />
  <div class="flex-1 rounded-xl bg-neutral-100 p-3 shadow dark:bg-neutral-900">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-neutral-800 dark:text-neutral-100">Date</div>
      <button @click="toggleDatepickerDialog" class="cursor-pointer">
        <PencilIcon class="size-4" />
      </button>
    </div>
    <div class="mt-1 text-sm text-neutral-700 dark:text-neutral-400">
      {{ formatedDate }}
    </div>
  </div>
</template>

<style scoped></style>
