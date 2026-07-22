<script setup lang="ts">
import DialogComponent from '@/components/dialogComponent.vue'
import { DayTotalType } from '@/types/DayTotalType'

// TODO: display individual expense then total for the group
const props = defineProps<{
  totals: DayTotalType
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()
const close = () => emits('close')
</script>
<template>
  <dialog-component @close="close()">
    <template #title> Total for {{ props.totals.date }} </template>

    <template #default>
      <div>
        <div v-for="(expense, index) in props.totals.expenses" :key="index">
          {{ expense }}
        </div>
      </div>
    </template>
  </dialog-component>
</template>

<style scoped></style>
