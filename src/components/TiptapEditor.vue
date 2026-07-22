<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { EditorContent, useEditor, type JSONContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { BubbleMenu } from '@tiptap/vue-3/menus'
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListBulletIcon,
  NumberedListIcon,
  H1Icon,
  H2Icon,
  H3Icon,
  MinusIcon,
} from '@heroicons/vue/16/solid'
import { useOverlayScrollbars } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'

const props = defineProps<{
  modelValue?: JSONContent
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: JSONContent): void
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [StarterKit],
  editorProps: {
    attributes: {
      class:
        'min-h-full rounded-2xl bg-transparent p-4 text-sm text-gray-700 outline-0 dark:text-gray-300',
    },
  },
  onUpdate: ({ editor }) => {
    // Emit the JSON content whenever the editor changes
    emits('update:modelValue', editor.getJSON())
  },
})

// Update editor content if modelValue changes externally (e.g., loading existing data asynchronously)
watch(
  () => props.modelValue,
  (newValue) => {
    if (
      editor.value &&
      newValue &&
      JSON.stringify(newValue) !== JSON.stringify(editor.value.getJSON())
    ) {
      editor.value.commands.setContent(newValue)
    }
  },
  { deep: true },
)

const rootRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  editor.value.commands.focus('end')

  setupOverlayScrollbars()
})

const setupOverlayScrollbars = () => {
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
}

const getBody = () => document.body
</script>

<template>
  <div class="size-full">
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      class="z-50"
      :append-to="getBody"
      :options="{
        placement: 'bottom',
        flip: true,
        offset: 8,
      }"
    >
      <div
        class="flex items-center gap-x-1 rounded-2xl bg-neutral-100 p-1 shadow dark:bg-neutral-700"
      >
        <button
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          :class="{ 'bg-neutral-200 dark:bg-neutral-600': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <BoldIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          :class="{ 'bg-neutral-200 dark:bg-neutral-600': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <ItalicIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'bg-neutral-200 dark:bg-neutral-700': editor.isActive('strike') }"
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <StrikethroughIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{
            'bg-neutral-200 dark:bg-neutral-600': editor.isActive('heading', { level: 1 }),
          }"
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <H1Icon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{
            'bg-neutral-200 dark:bg-neutral-600': editor.isActive('heading', { level: 2 }),
          }"
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <H2Icon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{
            'bg-neutral-200 dark:bg-neutral-600': editor.isActive('heading', { level: 3 }),
          }"
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <H3Icon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          @click="editor.chain().focus().setHorizontalRule().run()"
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
        >
          <MinusIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          :class="{ 'bg-neutral-200 dark:bg-neutral-600': editor.isActive('bulletList') }"
          @click="editor.chain().focus().toggleBulletList().run()"
        >
          <ListBulletIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
        <button
          class="cursor-pointer rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          :class="{ 'bg-neutral-200 dark:bg-neutral-600': editor.isActive('orderedList') }"
          @click="editor.chain().focus().toggleOrderedList().run()"
        >
          <NumberedListIcon class="size-4 text-neutral-600 dark:text-neutral-300" />
        </button>
      </div>
    </BubbleMenu>
    <div ref="rootRef" class="size-full rounded-2xl" data-overlayscrollbars-initialize>
      <editor-content
        v-if="editor"
        :editor="editor"
        class="prose dark:prose-invert size-full text-neutral-900 marker:text-neutral-600 dark:text-neutral-400 dark:marker:text-neutral-500"
      />
    </div>
  </div>
</template>
