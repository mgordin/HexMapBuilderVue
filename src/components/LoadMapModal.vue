<script setup>

import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

import Multiselect from '@vueform/multiselect'


const hs = useHexesStore();
const es = useEditorStore();

</script>

<template>

<div class="modal" v-bind:class="{'is-active': es.showLoadModal}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Load Map From Local Storage</p>
            <button class="delete" aria-label="close" @click="es.toggleLoadModal"></button>
        </header>
        <section class="modal-card-body">
            <Multiselect
                v-model="es.loadName"
                :close-on-select="true"
                :searchable="true"
                :create-option="false"
                placeholder="Select map to load..."
                :options="es.listSavedMaps"
            />
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary" @click="es.loadLocalMap">Load Selected Map</button>
            <button class="button" @click="es.toggleLoadModal">Cancel</button>
        </footer>
    </div>
</div>

</template>

<style>
.modal-card-body {
    height: 30vh;
}
</style>