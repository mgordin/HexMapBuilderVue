<template>
  <node-view-wrapper class="custom-mention-component" as="span">
      <span 
        :class="setClass(node.attrs.class)"
        :id="'hex-mention-'+thisUUID"
        @mouseenter="show"
        @focus="show"
        @blur="hide"
        @mouseleave="hide"
        @click="es.hexClicked(hexByUUID(node.attrs.uuid), {'shiftKey': false})"
      > 
        {{ hexByUUID(node.attrs.uuid).id }}
        
      </span>
      <div class="tooltip" :id="'tooltip-hex-mention-'+thisUUID" role="tooltip">
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
import { v4 as uuidv4 } from 'uuid';


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


var thisUUID = uuidv4()

onMounted(() => {

    mention = document.querySelector('#hex-mention-'+thisUUID);
    tooltip = document.querySelector('#tooltip-hex-mention-'+thisUUID);

    popperInstance = createPopper(mention, tooltip, {
        placement: "bottom",
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

function setClass(inputClass) {
  if (inputClass == 'test-class') {
    return 'hex-mention test-class'
  } else {
    return 'hex-mention'
  }
}

</script>

<style>

.hex-mention {
  white-space: nowrap;
  break-inside: avoid;
}

.custom-mention-component {
  cursor: pointer;
  border: 1px solid #000;
  border-radius: 0.4rem;
  padding: 0.1rem 0.3rem;
  white-space: nowrap;
  break-inside: avoid;
}

.test-class {
  color:blue;
  background: teal;
}

.custom-mention-component:hover {
  background-color: hsl(0, 0%, 21%);
  color: white;
  white-space: nowrap;
  break-inside: avoid;
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