<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";

const es = useEditorStore();
const hs = useHexesStore();

function shift() {
  return hs.getShiftPixels;
}

function paddingShift() {
  if (shift() == "83.5px") {
    return 0 + "px";
  } else {
    return 60 + "px";
  }
}

function logShift() {
  console.log(shift());
}

function logPaddingShift() {
  console.log(paddingShift());
}
</script>

<template>
  <div id="hex-container" class="hex-container">
    <div class="image-row flat-row" v-for="row in hs.hexes">
      <div
        class="image-hex flat-hex"
        v-for="hex in row"
        :key="hex.uuid"
        v-bind:class="{ 'hex-selected': es.activeHexes.includes(hex.uuid), 'hex-mentioned': es.mentioningHexes.includes(hex.uuid) }"
        v-bind:uuid="hex.uuid"
        @click="es.selectHex(hex, $event)"
      >
        <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" />
        <img
          class="hex-icon"
          v-if="hex.icon != null"
          v-bind="{ src: es.iconProperties[hex.icon].file }"
        />
        <img class="hex-overlay-mentioning" 
          :class="{ 'mentioning-overlay-active': es.mentioningHexes.find(h => h.uuid == hex.uuid) != null }" 
          src="blue.png"
        />
        <div class="hex-label">{{ hex.id }}</div>
      </div>
    </div>
  </div>
</template>

<style>
.hex-container {
  position: relative;
  overflow: scroll;
  height: calc(100vh - 52px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

/* Consolidated pointy-top and flat-top image hex stuff */
.image-row {
  display: flex; /* block;*/
  top: 60px;
}

.flat-row {
  margin-top: -5.25px;
}

.pointy-row {
  margin-left: 50px;
  margin-top: -26px;
}

.pointy-row:nth-child(even) {
  margin-left: 1px;
}

.image-hex {
  flex-shrink: 0; /* step 2: now the hexagons won't shrink but the horizontal scroll bar doesn't activate */
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.pointy-hex {
  height: 110px;
  width: 97px;
  margin: 0px;
}

.flat-hex {
  height: 96px;
  width: 110px;
  clip-path: polygon(0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%);
  overflow: hidden;
  display: inline-block;
  margin-left: 57.5px;
  margin-top: -42px; /*-47px;*/
  user-select: none;
}

.hex-terrain {
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
  opacity: 1;
}

.hex-overlay {
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
  opacity: 1;
  background-color: white;
  color: white
}

.image-hex:hover {
  opacity: 0.6
}

.hex-selected {
  opacity: 0.3;
}

.selected-overlay-active {
  opacity: 0.6
}

.flat-row:nth-child(even) {
  margin-left: v-bind(shift());
}

.hex-label {
  text-align: center;
  font-weight: bold;
  color: white;
}

.hex-container {
  padding-left: v-bind(paddingShift());
}

.hex-icon {
  position: absolute;
  width: 60px;
  left: 25px;
  top: 25px;
}

.hex-overlay-mentioning {
  position: absolute;
  left: 0px;
  top: 0px;
  overflow: hidden;
  opacity: 0;
}

.mentioning-overlay-active {
  opacity: 0.4
}

</style>
