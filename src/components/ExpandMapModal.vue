<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>



<template>
<div class="modal" v-bind:class="{'is-active': es.expandMapOpen}">
    <div class="modal-background"></div>
    <div class="modal-card settings-panel">
        <header class="modal-card-head">
            <p class="modal-card-title">Expand Map</p>
            <button class="delete" aria-label="close" @click="es.toggleExpandMapModal"></button>
        </header>
        <section class="modal-card-body">

            <div class="block">
                <label class="checkbox">
                    <input type="checkbox" v-model="es.generateContentOnMapExpand">
                    Generate content to fill expanded area?
                </label>
                <br/>
                <label>
                    Top rows to add:  
                    <input type="number" v-model="es.topRowsToAdd">
                </label>
                <br/>
                <label>
                    Bottom rows to add:  
                    <input type="number" v-model="es.bottomRowsToAdd">
                </label>
                <br/>
                <label>
                    Left columns to add:  
                    <input type="number" v-model="es.leftColumnsToAdd">
                </label>
                <br/>
                <label>
                    Right columns to add:  
                    <input type="number" v-model="es.rightColumnsToAdd">
                </label>
            </div>
            
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary" @click="es.expandMap">Expand Map</button>
            <button class="button" @click="es.toggleExpandMapModal">Cancel</button>
        </footer>
    </div>
</div>
</template>



<style>

.settings-panel {
    min-height:75vh;
}

</style>