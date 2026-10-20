<script setup lang="ts">
import CountrySelectComponent from '@/components/countrySelectComponent.vue'
import type { Country } from '@/types/country'
import { computed, onMounted, ref, watch } from 'vue'

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

// v-model bound to `number | null` (stores standard number, e.g. 12.5)
const value = defineModel<number | string | null>()

// Store internal value as raw integer cents (12.50 -> 1250)

const numericValue = computed(() => {
  if (value.value === null || value.value === undefined || value.value === '') {
    return 0
  }

  if (typeof value.value === 'string') {
    return Number(value.value)
  }

  return value.value
})

const rawCents = ref<number>(Math.round(numericValue.value * 100))

// Synchronize if parent changes `value` externally
watch(
  () => numericValue.value,
  (newVal) => {
    const nextCents = newVal ? Math.round(newVal * 100) : 0
    if (nextCents !== rawCents.value) {
      rawCents.value = nextCents
    }
  },
)

// Formats raw cents with thousands separators and 2 decimal places (e.g. "2,341,231.31")
const formattedValue = computed(() => {
  const amount = rawCents.value / 100
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
})

const handleKeydown = (e: KeyboardEvent) => {
  // Allow navigation and functional keys
  if (['Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Escape'].includes(e.key)) {
    return
  }

  // Handle submit key
  if (e.key === 'Enter') {
    emit('add')
    return
  }

  // Prevent default character insertion
  e.preventDefault()

  // Handle number entry (0-9)
  if (/^[0-9]$/.test(e.key)) {
    // Prevent excessive overflow (e.g. limit to 99,999,999.99)
    if (rawCents.value > 999999999) return

    rawCents.value = rawCents.value * 10 + parseInt(e.key, 10)
    value.value = rawCents.value / 100
  }

  // Handle Backspace
  if (e.key === 'Backspace') {
    rawCents.value = Math.floor(rawCents.value / 10)
    value.value = rawCents.value > 0 ? rawCents.value / 100 : null
  }
}

const handleCountrySelected = (country: Country): void => {
  emit('countrySelected', country)
}

const expenseValueInputRef = ref<HTMLInputElement | null>(null)
onMounted(() => {
  expenseValueInputRef.value?.focus()
})
</script>

<template>
  <div
    class="flex h-14 w-full items-center gap-x-4 bg-neutral-50 p-4 shadow transition-all
      duration-300 ease-in-out dark:bg-neutral-800"
    :class="[
      value ? 'rounded-b-none rounded-t-2xl' : 'rounded-2xl',
      {
        'border-b-red-500!': props.error && !value,
        'border-b-green-500!': props.success && !value,
        'rounded-2xl! dark:bg-neutral-900!': props.isEditing,
      },
    ]"
  >
    <input
      ref="expenseValueInputRef"
      type="text"
      inputmode="numeric"
      :value="formattedValue"
      @keydown="handleKeydown"
      placeholder="0.00"
      class="size-full bg-transparent text-end text-xl text-gray-700 outline-none
        dark:text-gray-200"
    />
    <country-select-component
      :isEditing="props.isEditing"
      :currency="props.currency"
      @countrySelected="handleCountrySelected"
    />
  </div>
</template>
