<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";
import Multiselect from '@vueform/multiselect'
import 'remixicon/fonts/remixicon.css'
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
<div class="hexDetailReader">
    <div class="block" 
        v-for="hex in hs.hexes.flat().filter(h => h.content != null && h.content.content.length > 0).sort(sortHexesComparison)"
        :id="hex.uuid"
    >
        <hr>
        <article class="media">
            <div class="media-left">
                <figure class="image is-48x48">
                    <img class="reader-hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" />
                </figure>
            </div>
            <div class="media-content">
                <div class="content">
                    <h1 class="title">{{hex.id}}</h1>
                </div>
            </div>
        </article>
        <span>
            <div class="tags">
                <MentionedByTagPopper v-for="mentioningHex in hs.mentionedByHexes(hex.uuid)" :hex="mentioningHex" />
            </div>
        </span>
        <TextEditor
            v-model="hex.content"
            :editable="false"
        />
        <div class="block">
            <a href="#hex-container-view">Back to map</a>
        </div>
    </div>
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