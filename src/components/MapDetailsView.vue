<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextViewer from "@/components/TextViewer.vue";
import Multiselect from '@vueform/multiselect'
import MentionedByTagPopper from "@/components/MentionedByTagPopper.vue"


const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
const hexByUUID = hs.hexByUUID;

function sortHexesComparison(a,b) {
    if (a.row > b.row) {
        return 1;
    } else if (b.row > a.row) {
        return -1;
    }
    if (a.column > b.column) {
        return 1;
    } else if (b.column > a.column) {
        return -1;
    }
}

</script>


<template>
<div id="hexDetailReader" class="hexDetailReader">
    <TextViewer
        v-model="hs.unifyContents"
        :editable="false"
    />
</div>
</template>


<style>
.hexDetailReader {
    background: white;
    padding-left: 10px;
}

.reader-hex-image {
    height: 48px;
    width: 55px;
    position: absolute;
}

.reader-hex-icon {
    margin-left: 10px;
    position: absolute;
}
</style>