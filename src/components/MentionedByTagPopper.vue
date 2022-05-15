<template>
<span :id="'hex-tag-'+hex.id" class="tag is-medium mentioningTag"
    @mouseenter="show"
    @focus="show"
    @blur="hide"
    @mouseleave="hide"
    @click="es.selectHex(hex, {shiftKey: false})"
>
    {{hex.id}}
</span>
<div class="tooltip" :id="'tooltip-hex-tag-'+numberToLetters(hex.uuid)" role="tooltip">
    <MentioningHexPopup2 :hex="hex"/>
    <div id="arrow" data-popper-arrow></div>
</div>
</template>


<script setup>
import { createPopper } from '@popperjs/core';
import { onMounted } from 'vue'
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"
import { useEditorStore } from "@/stores/editor";

const es = useEditorStore();


const props = defineProps({
  hex: {
        type: Object
      }
})

console.log('in tag for '+props.hex.id+' hex is', props.hex)

var popperInstance, button, tooltip = null

onMounted(() => {
    button = document.querySelector('#hex-tag-'+props.hex.id);
    tooltip = document.querySelector('#tooltip-hex-tag-'+numberToLetters(props.hex.uuid));

    popperInstance = createPopper(button, tooltip, {
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

.tooltip {
    background: white;
    color: black;
    font-weight: bold;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 4px;
    display: none;
    z-index: 999;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
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

.mentioningTag:hover {
    color: white;
    background-color: #333;
    cursor: pointer;
}

</style>