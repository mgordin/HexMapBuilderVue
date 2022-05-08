<template>
  <node-view-wrapper class="custom-mention-component" as="span">
      <span 
        class="hex-mention"
        :id="'hex-mention-'+hexByUUID(node.attrs.uuid).id"
        @mouseenter="show"
        @focus="show"
        @blur="hide"
        @mouseleave="hide"
        @click="es.selectHex(hexByUUID(node.attrs.uuid), {'shiftKey': false})"
      > 
        {{ hexByUUID(node.attrs.uuid).id }}
        
      </span>
      <div class="tooltip" :id="'tooltip-hex-mention-'+numberToLetters(hexByUUID(node.attrs.uuid).uuid)" role="tooltip">
          <MentioningHexPopup2 :hex="hexByUUID(node.attrs.uuid)" />
          <div id="arrow" data-popper-arrow></div>
      </div>
  </node-view-wrapper>
</template>

<script setup>
import { useHexesStore } from "@/stores/hexes";
import { useEditorStore } from '@/stores/editor'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { createPopper } from '@popperjs/core';
import { onMounted } from 'vue'
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"


const hs = useHexesStore();
const hexByUUID = hs.hexByUUID;

const es = useEditorStore()

const props = defineProps({
  nodeViewProps: nodeViewProps,
  node: {
    type: Object,
    required: true,
  }
})

var popperInstance, mention, tooltip = null

onMounted(() => {
    mention = document.querySelector('#hex-mention-'+hexByUUID(props.node.attrs.uuid).id);
    tooltip = document.querySelector('#tooltip-hex-mention-'+numberToLetters(hexByUUID(props.node.attrs.uuid).uuid));

    popperInstance = createPopper(mention, tooltip, {
        modifiers: [
            {
            name: 'offset',
            options: {
                offset: [0, 8],
            },
            },
        ],
    }); 
})

// Popper stuff
function show() {

    // Make the tooltip visible
    tooltip.setAttribute('data-show', '');

    // Update its position
    popperInstance.update();
}

function hide() {
  

    // Hide the tooltip
    tooltip.removeAttribute('data-show');

}

function numberToLetters(number) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    var result = ""

    while (number > 26) {
        result = result + "Z"
        number = number - 26
    }
    result = result + alphabet.charAt(number-1)
    return result
}


</script>

<style>

.hex-mention {
  white-space: nowrap;
}

.custom-mention-component {
  cursor: pointer;
}

.custom-mention-component:hover {
  background-color: hsl(0, 0%, 21%);
  color: white;
}

.tooltip {
    background: #333;
    color: white;
    font-weight: bold;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 4px;
    display: none;
    z-index: 999;
}

.tooltip[data-show] {
    display: block;
}

#arrow,
#arrow::before {
  position: absolute;
  width: 8px;
  height: 8px;
  background: inherit;
}

#arrow {
  visibility: hidden;
}

#arrow::before {
  visibility: visible;
  content: '';
  transform: rotate(45deg);
}

.tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

.tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

.tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

.tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}

</style>