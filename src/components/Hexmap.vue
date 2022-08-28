<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import { useMousePressed } from '@vueuse/core'

const es = useEditorStore();
const hs = useHexesStore();

const { pressed } = useMousePressed()


function scale(val) {
  return (val * es.hexScale)
}

function shift() {
  return hs.getShiftValue;
}

function scaledShift() {
  return hs.getShiftValue * es.hexScale;
}

function scaledPaddingShift() {
  return paddingShift() * es.hexScale;
}

function px(val) {
  return val + 'px'
}

function paddingShift() {
  if (shift() == 83.5) {
    return 0;
  } else {
    return 60;
  }
}

function labelVisiblity() {
  if (es.showHexLabels) {
    return "visible"
  } else {
    return "hidden"
  }
}

function logShift() {
  console.log(shift());
}

function logPaddingShift() {
  console.log(paddingShift());
}

import PopperComponent from "@/components/PopperComponent.vue"
import MentionedByTagPopper from "@/components/MentionedByTagPopper.vue"

const hexByUUID = hs.hexByUUID


</script>

<template>
  <div id="hex-container" 
    class="hex-container" 
    :style="{cursor: (es.currentTool == 'hex-editor') ? 'auto' : 'url(./misc-images/paint-brush-line.png), auto'}"
    >
    <div class="image-row flat-row" v-for="row in hs.hexes" draggable="false">
      <div
        class="image-hex flat-hex"
        v-for="hex in row"
        :key="hex.uuid"
        v-bind:class="{ 'hex-selected': es.activeHexes.includes(hex.uuid), 'hex-mentioned': es.mentioningHexes.includes(hex.uuid) }"
        v-bind:uuid="hex.uuid"
        @click="es.hexClicked(hex, $event)"
        @mousedown="(es.currentTool == 'terrain-painter') ? es.hexClicked(hex, $event) : null"
        @mouseenter="(pressed) ? es.hexClicked(hex, $event) : null"
        draggable="false"
      >
        <img class="hex-terrain" v-bind="{ src: es.terrainToImage[hex.terrain].file }" draggable="false"/>
        <img
          class="hex-icon"
          v-if="hex.icon != null"
          v-bind="{ src: es.iconProperties[hex.icon].file }"
          draggable="false"
        />
        <img class="hex-overlay-mentioning" 
          :class="{ 'mentioning-overlay-active': es.mentioningHexes.find(h => h.uuid == hex.uuid) != null }" 
          src="blue.png"
          draggable="false"
        />
        <div class="hex-label" draggable="false">{{ hex.id }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  top: v-bind(px(scale(60)));
}

.flat-row {
  margin-top: v-bind(px(scale(-5.25)));
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
  height: v-bind(px(scale(96)));
  width: v-bind(px(scale(110)));
  clip-path: polygon(0 50%, 25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%);
  overflow: hidden;
  display: inline-block;
  margin-left: v-bind(px(scale(57.5)));
  margin-top: v-bind(px(scale(-42)));
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
  margin-left: v-bind(px(scaledShift()));
}

.hex-label {
  text-align: center;
  font-weight: bold;
  color: white;
  visibility: v-bind(labelVisiblity());
}

.hex-container {
  padding-left: v-bind(px(scaledPaddingShift()));
}

.hex-icon {
  position: absolute;
  max-width: v-bind(px(scale(60)));
  max-height: v-bind(px(scale(60)));
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  
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
