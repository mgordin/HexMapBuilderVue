<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import 'remixicon/fonts/remixicon.css'


const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
const hexByUUID = hs.hexByUUID;


</script>

<template>
  <div class="sidebar-main">

    <!-- Real sidebar content -->
    <div class="card">
        <!-- Terrain selector -->
      <div class="block">
          <div class="card">
            <header class="card-header has-background-primary">
              <div class="level header-div">
                
                <i class="ri-compass-discover-fill section-icon"></i>
                <p class="card-header-title">Terrain Painter</p>
            
              </div>
              
            </header>

            <div class="card-content">
              <div class="columns is-multiline">
                <div
                  class="box"
                  v-for="(terrainProperties, terrainName) in es.paintTerrainProperties"
                  v-bind:class="{ 'has-background-primary': terrainProperties.selected }"
                  @click="es.selectPaintTerrain(terrainName)"
                  :title="terrainName"
                >
                  <img class="terrain-picker-hex" v-bind="{ src: terrainProperties.file }" />
                </div>
              </div>
            </div>            
          </div>
        </div>
    </div>
  </div>
</template>

<style>

.sidebar-main {
  height: calc(100vh - 52px);
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  box-shadow: 2px 0 10px lightgray;
  user-select: none;
}

.sidebar-main::-webkit-scrollbar {
  display: none;
}



.sidebar-header {
  display: flex;
  align-items: center;
  padding-top: 15px;
  padding-bottom: 15px;
}

.sidebar-hex-image {
  width: 50px;
  margin-left: 10px;
}

.terrain-picker-hex{
  height: 38px;
  width: 44px;
}

.icon-picker {
  max-height: 45px;
  max-width: 45px;
}

.icon-picker-container {
  width: 90px;
  height: 90px;
}

.mentioning-hex {
  cursor: pointer;
}

.mentioning-hex:hover {
  background-color: hsl(0, 0%, 21%);
  color: white;
}

.mentioning-hex-icon {
  pointer-events: none;
}

.randomize {
  top: 12px;
  left: -10px;
}

.randomize:hover {
  transform: scale(1.1)
}

.terrain-dropdown-option {
  text-align: center;
}

.terrain-dropdown-text {
  text-align: center;
  margin-left: 10px;
}

.hex-search-item-content {
  max-block-size: 20px;
  max-inline-size: 20px;
  block-size: 20px;
  inline-size: 20px;
  width: 20px;
  max-width: 20px;
}

@keyframes flickerAnimation {
  0%   { opacity:1; }
  50%  { opacity:0.3; }
  100% { opacity:1; }
}
.animate-flicker {
    opacity:1;  
    animation: flickerAnimation 1s infinite;
}

.rerandomize-indicator {
  top: 16px;
  left: 10px;
}

.rerandomize-button {
  margin-right: 15px;
  margin-bottom: 20px;
}

.rerandomize-button-header {
  margin-right: 15px;
}

.section-icon {
  margin-left: 10px;
}

.details {
  margin-right: 5px;
}

.header-div {
  display: flex;
  flex-grow: 1;
}

.multiselect-tag {
  background: hsl(0, 0%, 29%)
}

.highlighted {
  color: white;
}

</style>
