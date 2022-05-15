<template>
  <editor-content :editor="editor" />
</template>

<script setup>

import { useEditor, Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import suggestion from '@/suggestion'
import { watch, onBeforeUnmount, defineEmits, defineProps } from 'vue'
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from '@/components/MentionList.vue'
import { mergeAttributes } from "@tiptap/core";
// import Mention from "@tiptap/extension-mention";
import Mention from "@/MentionExport";
import { useHexesStore } from "@/stores/hexes";
import Placeholder from '@tiptap/extension-placeholder'

import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/themes/light.css';


const hs = useHexesStore();

const hexByUUID = hs.hexByUUID;

const props = defineProps({
  modelValue: {
      type: Object, // String for HTML - but HTML seems to break mentions
      default: '',
    },
  showMentionTooltip: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['update:modelValue'])

var thisClass = "mention"
if (!props.showMentionTooltip) {
  thisClass = "mention no-tooltip"
}

const editor = new Editor({
      editable: props.editable,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Fill in some info about the hex...'
        }),
        Mention.configure({
          HTMLAttributes: {
            class: thisClass,
          },
          suggestion: {
            items: ({ query }) => {
              return hs.hexes.flat().filter(item => item.id.startsWith(query)).slice(0, 5)
            },

            render: () => {
              let component
              let popup

              return {
                onStart: props => {
                  component = new VueRenderer(MentionList, {
                    // using vue 2:
                    // parent: this,
                    // propsData: props,
                    // using vue 3:
                    props,
                    editor: props.editor,
                  })

                  popup = tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    theme: 'light',
                    arrow: false
                  })
                },

                onUpdate(props) {
                  component.updateProps(props)

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  })
                },

                onKeyDown(props) {
                  if (props.event.key === 'Escape') {
                    popup[0].hide()

                    return true
                  }

                  return component.ref?.onKeyDown(props)
                },

                onExit() {
                  popup[0].destroy()
                  component.destroy()
                },
              }
            },
          }
        }),
      ],
      content: props.modelValue,
      onUpdate: () => {
        // HTML
        // emits('update:modelValue', editor.getHTML())

        // JSON
        emits('update:modelValue', editor.getJSON())
      },
    })

onBeforeUnmount(() => {
  editor.destroy()
})

watch(() => props.modelValue, (currentValue, oldValue) => {
  // HTML
  // const isSame = editor.getHTML() === currentValue

  // JSON
  const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(currentValue)

  if (isSame) {
    return
  }

  editor.commands.setContent(currentValue, false)
})

</script>


<style>
.custom-mention-component {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  white-space: nowrap;
  break-inside: avoid;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror {
  color: black;
  background: white;
}
</style>