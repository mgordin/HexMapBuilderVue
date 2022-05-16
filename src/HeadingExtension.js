import { Mark, mergeAttributes } from '@tiptap/core'

const headingH1 = Mark.create( {
  name: "headingH1",

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute( 'id' ),
        renderHTML: attributes => {
          if( !attributes.id ) {
            return {}
          }

          return {
            'id': attributes.id
          }
        } 
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="headingH1" style="font-size:2em"]',
      }
    ]
  },

  renderHTML( { HTMLAttributes } ) {
    return [ 'span', mergeAttributes( { 'data-type': 'headingH1', 'style': "font-size:2em" }, HTMLAttributes ), 0 ]
  },

  addCommands() {
    return {
      setJumpAnchor: ( attributes ) => ( { chain } ) => {
        return chain().extendMarkRange( 'headingH1' ).setMark( 'headingH1', attributes ).run()
      },  
      getJumpAnchor: () => ( { commands } ) => {
        if ( this.editor.view.state.selection.$from.nodeAfter == null ) { return }

        let node = this.editor.view.state.selection.$from.nodeAfter
        let mark = node.marks.find( mark => mark.type && mark.type.name == "headingH1" )
        
        if ( mark ) { return mark.attrs.id }
      },
      unsetJumpAnchor: () => ( { commands } ) => {
        console.log( "unsetJumpAnchor not written..." )
      }
    }
  }
} ) 

export default headingH1