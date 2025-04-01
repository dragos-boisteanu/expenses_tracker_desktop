<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex size-full">
    <div class="h-full w-1/3 border-r-[1px] border-r-neutral-200 bg-neutral-50 py-4 shadow-2xl">
      <div class="mb-8 w-full text-center text-3xl text-gray-800">Expenses</div>
      <div class="overflow-y-auto bg-transparent p-4">
        <div
          class="mt-2 flex w-full items-baseline justify-between gap-1.5 text-sm text-gray-700"
          v-for="index in 3"
          :key="index"
        >
          <div>500 RON</div>
          <div class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800"></div>
          <div>12/12/2005</div>
        </div>
        <div class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600">
          <div>100.000.000 RON</div>
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
          <div>Yesterday</div>
        </div>
        <div
          class="mt-3 flex w-full items-baseline justify-between gap-1.5 text-sm text-gray-700"
          v-for="index in 4"
          :key="index"
        >
          <div>500 RON</div>
          <div class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800"></div>
          <div>12/12/2005</div>
        </div>
        <div class="mt-2 flex w-full items-center justify-between gap-1.5 text-xs text-indigo-600">
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
          <div>24/12/2004</div>
          <div class="h-fit flex-1 border-b-[1px] border-b-indigo-600"></div>
        </div>
        <div
          class="mt-2 flex w-full items-baseline justify-between gap-1.5 text-sm text-gray-700"
          v-for="index in 1"
          :key="index"
        >
          <div>500 RON</div>
          <div class="h-fit flex-1 border-b-[1px] border-dashed border-b-gray-800"></div>
          <div>12/12/2005</div>
        </div>
      </div>
    </div>
    <div class="flex h-full flex-1 flex-col items-center justify-center gap-12 bg-neutral-100">
      <div class="h-fit w-2/3 rounded-2xl bg-neutral-50">
        <input
          class="size-full rounded-2xl border-2 border-transparent bg-transparent p-4 text-xl text-gray-700 shadow outline-none focus:border-b-indigo-600"
          type="text"
          inputmode="decimal"
          placeholder="Enter value"
        />
      </div>

      <button
        class="group flex size-18 cursor-pointer items-center justify-center rounded-full bg-indigo-600 p-4 text-2xl text-neutral-50 shadow hover:bg-indigo-700 active:bg-indigo-500 active:inset-shadow-sm"
      >
        <PlusIcon class="size-12 text-neutral-50 group-hover:text-neutral-100" />
      </button>
    </div>
  </div>
</template>
