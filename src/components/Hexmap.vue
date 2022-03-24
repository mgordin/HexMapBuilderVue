<script setup>
    import { useEditorStore } from '@/stores/editor'
    import { useHexesStore } from '@/stores/hexes'

    const es = useEditorStore();
    const hs = useHexesStore();
</script>

<template>
    <div class="container">
        <div class="image-row flat-row" v-for="row in hs.hexes">
            <div class="image-hex flat-hex" v-for="hex in row" :key="hex.id" >
                <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" @click="es.selectHex(hex)">
                <div class="hex-overlay"></div>
                <svg class="hex-border" viewbox="-4 0 110 96" v-bind:class="{'is-hidden': es.activeHexID != hex.id}">
                    <polygon class="hex-border" points="28 3,75 3,100 50,75 97,28 97,0 50" stroke="white" fill="transparent" stroke-width="5"></polygon>
                </svg>
            </div>
        </div>
    </div>
</template>