<script setup>
    import { useEditorStore } from '@/stores/editor'
    import { useHexesStore } from '@/stores/hexes'

    const es = useEditorStore();
    const hs = useHexesStore();
</script>

<template>
    <div class="container">
        <div class="image-row flat-row" v-for="row in hs.hexes">
            <div class="image-hex flat-hex" v-for="hex in row" :key="hex.id" v-bind:class="{'hex-selected': es.activeHexID == hex.id}" >
                <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" @click="es.selectHex(hex)">
                <div class="hex-overlay"></div>
            </div>
        </div>
    </div>
</template>