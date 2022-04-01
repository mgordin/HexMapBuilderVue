<script setup>
    import { useEditorStore } from '@/stores/editor'
    import { useHexesStore } from '@/stores/hexes'

    const es = useEditorStore();
    const hs = useHexesStore();

    function shift() {
        return hs.getShiftPixels
    }

    function logShift() {
        console.log(shift())
    }
</script>

<template>
    <div class="hex-container">
        <div class="image-row flat-row" v-for="row in hs.hexes" :style="{  }">
            <div class="image-hex flat-hex" v-for="hex in row" :key="hex.uuid" v-bind:class="{'hex-selected': es.activeHexes.includes(hex.uuid)}" v-bind:uuid="hex.uuid">
                <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" @click="es.selectHex(hex, $event)">
                <div class="hex-overlay"></div>
            </div>
        </div>
    </div>
</template>

<style>

.flat-row:nth-child(even){
  margin-left: v-bind(shift());
}

</style>