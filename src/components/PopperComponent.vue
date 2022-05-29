<template>
<button id="button" aria-describedby="tooltip" 
    @mouseenter="show"
    @focus="show"
    @blur="hide"
    @mouseleave="hide"
>
    My button
</button>
<div id="tooltip" role="tooltip">
    <MentioningHexPopup2/>
    <div id="arrow" data-popper-arrow></div>
</div>
</template>


<script setup>
import { createPopper } from '@popperjs/core';
import { onMounted } from 'vue'
import SampleComponent from "@/components/SampleComponent.vue"
import TextEditor from "@/components/TextEditor.vue";
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"

var popperInstance, button, tooltip = null


onMounted(() => {
    button = document.querySelector('#button');
    tooltip = document.querySelector('#tooltip');

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

    console.log('stuff', button, tooltip, popperInstance)

    
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

function logPopper() {
    console.log('stuff2', button, tooltip, popperInstance)
}

</script>

<style>
#tooltip {
    background: #333;
    color: white;
    font-weight: bold;
    padding: 4px 8px;
    font-size: 13px;
    border-radius: 4px;
    display: none;
}

#tooltip[data-show] {
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

#tooltip[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#tooltip[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#tooltip[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#tooltip[data-popper-placement^='right'] > #arrow {
  left: -4px;
}

</style>