<script setup>
    import { useEditorStore } from '@/stores/editor'
    import { useHexesStore } from '@/stores/hexes'

    const es = useEditorStore();
    const hs = useHexesStore();

    function shift() {
        return hs.getShiftPixels
    }

    function paddingShift() {
        if (shift() == '83.5px') {
            return 0 + "px";
        } else {
            return 60 + "px";
        }
    }

    function logShift() {
        console.log(shift())
    }

    function logPaddingShift() {
        console.log(paddingShift())
    }
</script>

<template>
    <div class="hex-container">
        <div class="image-row flat-row" v-for="row in hs.hexes">
            <div class="image-hex flat-hex" v-for="hex in row" :key="hex.uuid" v-bind:class="{'hex-selected': es.activeHexes.includes(hex.uuid)}" v-bind:uuid="hex.uuid">
                <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" @click="es.selectHex(hex, $event)">
                <div class="hex-overlay"></div>
                <div class="hex-label">{{hex.id}}</div>
            </div>
        </div>
    </div>
</template>

<style>

.flat-row:nth-child(even){
  margin-left: v-bind(shift());
}

.hex-label {
    top: 5px;
    left: 45px;
}

.hex-container {
    padding-left: v-bind(paddingShift());
}

</style>