<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>



<template>
<div class="modal" v-bind:class="{'is-active': es.initializeMapModelShown}">
    <div class="modal-background"></div>
    <div class="modal-card initialize-map-settings">
        <header class="modal-card-head">
            <p class="modal-card-title">Initialize map</p>
        </header>
        <section class="modal-card-body">
            <div class="block">
                <label class="label">Terrain Type</label>
                <div class="dropdown" :class="{'is-active': es.terrainDropdownOpen}" @click="es.toggleTerrainDropdown">
                    <div class="dropdown-trigger">
                        <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
                        <span>{{es.terrainType}}</span>
                        <span class="icon is-small">
                            <i class="ri-arrow-down-s-line" aria-hidden="true"></i>
                        </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu" role="menu">
                        <div class="dropdown-content">
                            <a href="#" class="dropdown-item" @click="es.setTerrainType('temperate forest')">
                                temperate forest
                            </a>
                            <a href="#" class="dropdown-item" @click="es.setTerrainType('error value')">
                                Some Other Terrain
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="block">
                <label>
                Base fraction of hexed with content generated:  
                <input type="number" v-model="es.baseFractionWithContent">
                </label>
            </div>
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
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, es.initializeHexRows, es.initializeHexColumns)">Initialize map</button>
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, 2, 2)">2x2</button>
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, 3, 3)">3x3</button>
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, 4, 4)">4x4</button>
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, 8, 8)">8x8</button>
            <button class="button is-success" @click="hs.initializeMap(es.terrainType, 16, 16)">16x16</button>
        </footer>
    </div>
</div>
</template>



<style>

.initialize-map-settings {
    min-height: 70vh;
}

</style>