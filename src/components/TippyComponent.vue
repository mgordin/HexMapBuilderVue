<template>
<button id="myButton">Tippy button</button>

<div id="template" style="display: none">
    <TextEditor/>
</div>
</template>

<script setup>
import { onMounted } from 'vue'
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
import SampleComponent from "@/components/SampleComponent.vue"
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";


const es = useEditorStore();
const hs = useHexesStore();

const hexByUUID = hs.hexByUUID;


onMounted(() => {

    const template = document.getElementById('template');

    tippy('#myButton', {
        content: template.innerHTML,
        placement: 'bottom',
        allowHTML: true
    });
})

</script>


<style>

</style>