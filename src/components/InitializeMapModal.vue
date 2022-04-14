<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>



<template>
<div class="modal" v-bind:class="{'is-active': es.initializeMapModelShown}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Initialize map</p>
        </header>
        <section class="modal-card-body">
            <label class="label">Rows</label>
            <div class="control">
                <input class="input" type="number" min="1" placeholder="Number of rows" v-model="es.initializeHexRows">
            </div>
            <label class="label">Columns</label>
            <div class="control">
                <input class="input" type="number" min="1" placeholder="Number of columns" v-model="es.initializeHexColumns">
            </div>
        </section>
        <footer class="modal-card-foot">
            <button class="button is-success" @click="hs.initializeHexGrid(es.initializeHexRows, es.initializeHexColumns)">Initialize map</button>
            <button class="button is-success" @click="hs.initializeHexGrid(2, 2)">2x2</button>
            <button class="button is-success" @click="hs.initializeHexGrid(3, 3)">3x3</button>
            <button class="button is-success" @click="hs.initializeHexGrid(4, 4)">4x4</button>
            <button class="button is-success" @click="hs.initializeHexGrid(8, 8)">8x8</button>
            <button class="button is-success" @click="hs.initializeHexGrid(16, 16)">16x16</button>
        </footer>
    </div>
</div>
</template>



<style>

</style>