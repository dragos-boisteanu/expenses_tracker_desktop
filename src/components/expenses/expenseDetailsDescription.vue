<script setup lang="ts">
import { generateHTML, JSONContent } from '@tiptap/vue-3'
import { computed, onMounted, ref } from 'vue'
import StarterKit from '@tiptap/starter-kit'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import { PencilIcon } from '@heroicons/vue/24/outline'
import EditExpenseDescriptionDialog from '@/components/expenses/editExpenseDescriptionDialog.vue'

const props = defineProps<{
  id: number
  description?: JSONContent
}>()

const HTMLDescription = computed(() => {
  if (!props.description) return ''
  return generateHTML(props.description, [StarterKit])
})

const isEditing = ref<boolean>(false)
const toggleEdit = () => {
  isEditing.value = !isEditing.value
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
  <edit-expense-description-dialog
    v-if="isEditing"
    :id="id"
    :description="props.description"
    @close="toggleEdit"
  />
  <div class="mt-4 w-full rounded-xl bg-neutral-100 p-3 shadow dark:bg-neutral-900">
    <div class="flex items-center justify-between">
      <div class="font-semibold text-neutral-800 dark:text-neutral-100">Description</div>
      <button @click="toggleEdit" class="cursor-pointer">
        <PencilIcon class="size-4" />
      </button>
    </div>
    <div class="mt-1 h-36">
      <div ref="rootRef" class="size-full" data-overlayscrollbars-initialize>
        <div class="prose dark:prose-invert p-2 text-sm" v-html="HTMLDescription"></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
