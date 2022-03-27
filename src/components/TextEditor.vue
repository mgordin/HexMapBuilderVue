<template>
  <editor-content :editor="editor" />
</template>

<script setup>

import { useEditor, Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Mention from '@tiptap/extension-mention'
import suggestion from '@/suggestion'
import { watch, onBeforeUnmount, defineEmits, defineProps } from 'vue'
import { useMentionStore } from "@/stores/mentions";
import { VueRenderer } from '@tiptap/vue-3'
import tippy from 'tippy.js'
import MentionList from '@/components/MentionList.vue'

const ms = useMentionStore()

const props = defineProps({
  modelValue: {
      type: String,
      default: '',
    }
})

const emits = defineEmits(['update:modelValue'])

const editor = new Editor({
      extensions: [
        StarterKit,
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion: {
            items: ({ query }) => {
              return ms.people.filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
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
        emits('update:modelValue', editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })

onBeforeUnmount(() => {
  editor.destroy()
})

watch(() => props.modelValue, (currentValue, oldValue) => {
  // HTML
  const isSame = editor.getHTML() === currentValue

  // JSON
  // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

  if (isSame) {
    return
  }

  editor.commands.setContent(currentValue, false)
})

</script>

 <script>
// import { Editor, EditorContent } from '@tiptap/vue-3'
// import StarterKit from '@tiptap/starter-kit'
// import Mention from '@tiptap/extension-mention'
// import suggestion from '@/suggestion'

// export default {
//   components: {
//     EditorContent,
//   },

//   props: {
//     modelValue: {
//       type: String,
//       default: '',
//     },
//   },

//   data() {
//     return {
//       editor: null,
//     }
//   },

//   watch: {
//     modelValue(value) {
//       // HTML
//       const isSame = this.editor.getHTML() === value

//       // JSON
//       // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

//       if (isSame) {
//         return
//       }

//       this.editor.commands.setContent(value, false)
//     }
//   },

//   mounted() {
//     this.editor = new Editor({
//       extensions: [
//         StarterKit,
//         Mention.configure({
//           HTMLAttributes: {
//             class: 'mention',
//           },
//           suggestion
//         }),
//       ],
//       content: this.modelValue,
//       onUpdate: () => {
//         // HTML
//         this.$emit('update:modelValue', this.editor.getHTML())

//         // JSON
//         // this.$emit('update:modelValue', this.editor.getJSON())
//       },
//     })
//   },

//   beforeUnmount() {
//     this.editor.destroy()
//   },
// }
</script>

<style>
.mention {
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  box-decoration-break: clone;
}
</style>