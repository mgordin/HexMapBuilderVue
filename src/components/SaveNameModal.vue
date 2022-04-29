<script setup>

import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'


const hs = useHexesStore();
const es = useEditorStore();

</script>

<template>

<div class="modal" v-bind:class="{'is-active': es.showSaveNameModal}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Save As</p>
            <button class="delete" aria-label="close" @click="es.toggleSaveNameModal"></button>
        </header>
        <section class="modal-card-body">
            <label>Name to save map under</label>
            <input class="input" type="text" placeholder="Name to save map under" v-model="es.saveName">
        </section>
        <footer class="modal-card-foot">
            <button class="button is-primary" @click="es.saveMapLocally">Save Map to Local Storage</button>
            <button class="button" @click="es.toggleSaveNameModal">Cancel</button>
        </footer>
    </div>
</div>

</template>

<style>

</style>