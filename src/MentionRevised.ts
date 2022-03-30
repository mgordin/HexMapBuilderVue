import { Node, mergeAttributes } from '@tiptap/core'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { PluginKey } from 'prosemirror-state'
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion'
import CustomMentionComponent from "./components/CustomMentionComponent.vue"
import { VueNodeViewRenderer } from '@tiptap/vue-3'



export type MentionOptions = {
  HTMLAttributes: Record<string, any>,
  suggestion: Omit<SuggestionOptions, 'editor'>,
}

export const MentionPluginKey = new PluginKey('mention')

export const Mention = Node.create<MentionOptions>({
  name: 'mention',

  addOptions() {
    return {
      HTMLAttributes: {},
      
      suggestion: {
        char: '@',
        pluginKey: MentionPluginKey,
        command: ({ editor, range, props }) => {
          // increase range.to by one when the next node is of type "text"
          // and starts with a space character
          const nodeAfter = editor.view.state.selection.$to.nodeAfter
          const overrideSpace = nodeAfter?.text?.startsWith(' ')

          if (overrideSpace) {
            range.to += 1
          }

          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run()
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from)
          const type = state.schema.nodes[this.name]
          const allow = !!$from.parent.type.contentMatch.matchType(type)

          return allow
        },
      },
    }
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      uuid: {
        default: null,
        parseHTML: (element) => {
          return {
            uuid: element.getAttribute("data-mention-uuid")
          };
        },
        renderHTML: (attributes) => {
          if (!attributes.uuid) {
            return {};
          }

          return {
            "data-mention-uuid": attributes.uuid
          };
        }
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: `custom-mention-component[data-mention-uuid]`,
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'custom-mention-component',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
    ]
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr, state }) => {
        let isMention = false
        const { selection } = state
        const { empty, anchor } = selection

        if (!empty) {
          return false
        }

        state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
          if (node.type.name === this.name) {
            isMention = true
            tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize)

            return false
          }
        })

        return isMention
      }),
    }
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ]
  },

  addNodeView() {
    return VueNodeViewRenderer(CustomMentionComponent)
  },
})