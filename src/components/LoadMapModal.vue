<script setup>

import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

import Multiselect from '@vueform/multiselect'

import { onMounted } from 'vue';
import { ref } from 'vue';


const hs = useHexesStore();
const es = useEditorStore();

function reloadList() {
    es.getSavedMaps()
    es.loadName = null
}

onMounted(() => {
    reloadList()
})

</script>

<template>

<div class="modal is-active">
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
                :options="es.savedMaps"
            />
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary" @click="es.loadLocalMap">Load Selected Map</button>
            <button class="button is-danger" @click="es.deleteLocalMap">Delete Selected Map</button>
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