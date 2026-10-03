<script setup lang="ts">
import CountrySelectComponent from '@/components/countrySelectComponent.vue'
import { Country } from '@/types/country'
import { onMounted, ref } from 'vue'

const props = defineProps<{
  error?: boolean
  success?: boolean
  currency?: string
  isEditing?: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'countrySelected', value: Country): void
}>()

const value = defineModel<number | string | null>()

const handleCountrySelected = (country: Country): void => {
  emit('countrySelected', country)
}

const expenseValueInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  if (expenseValueInputRef.value) {
    expenseValueInputRef.value.focus()
  }
})
</script>

<template>
  <div
    class="flex w-full items-center gap-x-2 bg-neutral-50 h-14 p-4 shadow transition-all
      duration-300 ease-in-out dark:bg-neutral-800"
    :class="[
      value ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl',

      {
        'border-b-red-500!': props.error && !value,
        'border-b-green-500!': props.success && !value,
        'rounded-2xl! dark:bg-neutral-900!': props.isEditing,
      },
    ]"
  >
    <input
      ref="expenseValueInputRef"
      @keydown="(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()"
      class="size-full bg-transparent text-xl text-gray-700 outline-none dark:text-gray-200"
      v-model="value"
      type="number"
      placeholder="Value"
      @keydown.enter="emit('add')"
    />
    <country-select-component
      :isEditing="props.isEditing"
      :currency="props.currency"
      @countrySelected="handleCountrySelected"
    />
  </div>
</template>

<style scoped></style>
