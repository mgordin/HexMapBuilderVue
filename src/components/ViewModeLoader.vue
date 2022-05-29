<script setup>

import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'


const hs = useHexesStore();
const es = useEditorStore();

</script>

<template>

<div class="modal" v-bind:class="{'is-active': es.showViewModeLoaderModal}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Loading View Mode</p>
            <button class="delete" aria-label="close" @click="es.toggleViewModeLoaderModal"></button>
        </header>
        <section class="modal-card-body">
            Loading view mode
            <progress class="progress" :value="es.viewModeProgress" max="100">{{es.viewModeProgress*100}}</progress>
        </section>
        <footer class="modal-card-foot">
            
        </footer>
    </div>
</div>

</template>

<style>

</style>