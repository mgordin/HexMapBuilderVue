import { mergeAttributes } from "@tiptap/core";
import Mention from "@tiptap/extension-mention";
import { useHexesStore } from "@/stores/hexes";
import CustomMentionComponent from "@/components/CustomMentionComponent"
import { VueNodeViewRenderer } from '@tiptap/vue-3'


const hs = useHexesStore();

const hexByUUID = hs.hexByUUID;

export const CustomMention = Mention.extend({
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
      };
    },
    parseHTML() {
      return [
        {
          tag: "custom-mention-component[data-mention-uuid]"
        }
      ];
    },
  
    renderHTML({ node, HTMLAttributes }) {
  
      return [
        "custom-mention-component",
        mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
      ];
    },
  
    renderText({ node }) {
      const hex = hexByUUID(node.attrs.uuid);
  
      if (hex) {
        return `${this.options.suggestion.char}${hex.id}`;
      }
  
      return "unkown";
    }
  });