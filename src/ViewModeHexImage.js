import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

export default Image.extend({
    name: 'hex-image',
    addAttributes() {
        return {
            ...Image.config.addAttributes(),
            style: {
                default: 'width: 110px; height: 96px; padding-right: 10px',
            }
        }
    },
    renderHTML({ node, HTMLAttributes }) {

        const style = node.attrs.style
        HTMLAttributes.style = style

        return [
            'img',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)
        ]
    }
})