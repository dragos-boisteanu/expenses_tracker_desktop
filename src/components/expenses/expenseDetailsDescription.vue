<script setup lang="ts">
import TiptapEditor from '@/components/TiptapEditor.vue'
import { generateHTML, JSONContent } from '@tiptap/vue-3'
import { computed, onMounted, ref, watchEffect } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import { PencilIcon } from '@heroicons/vue/24/outline'

const emits = defineEmits<{
  (e: 'editActive', value: boolean): void
}>()

const props = defineProps<{
  closeEdit: boolean
}>()

watchEffect(() => {
  if (props.closeEdit) {
    isEditing.value = false
    emits('editActive', false)
  }
})

const description = defineModel<JSONContent>()

const HTMLDescription = computed(() => {
  if (!description.value) return ''
  return generateHTML(description.value, [StarterKit])
})

const isEditing = ref<boolean>(false)
const toggleEdit = () => {
  isEditing.value = !isEditing.value

  emits('editActive', isEditing.value)
}

const rootRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (!rootRef.value) return

  const [initialize] = useOverlayScrollbars({
    defer: true,
    options: {
      scrollbars: {
        visibility: 'auto',
      },
    },
  })

  initialize(rootRef.value)
})
</script>

<template>
  <div class="mt-4 w-full rounded-xl bg-neutral-100 p-3 shadow dark:bg-neutral-900">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-neutral-800 dark:text-neutral-100">Description</div>
      <button @click="toggleEdit" class="cursor-pointer">
        <PencilIcon class="size-4" />
      </button>
    </div>
    <div class="mt-1 h-36">
      <div
        v-if="isEditing"
        class="size-full rounded-2xl bg-neutral-50 text-sm shadow dark:bg-neutral-800"
      >
        <TiptapEditor v-model="description" />
      </div>
      <div ref="rootRef" class="size-full" data-overlayscrollbars-initialize v-show="!isEditing">
        <div class="prose dark:prose-invert p-2 text-sm" v-html="HTMLDescription"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
