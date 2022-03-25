<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";

const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
</script>

<template>
  <button class="button" @click="hs.makeHexForTesting(es.activeRow)">Make a hex</button>
  <input class="input" v-model="es.activeRow" />
  <button class="button" @click="hs.initializeMapForTesting">
    Set up 8x8 blank hexes
  </button>
  <button class="button" @click="es.deselectAllHexes">Deselect all</button>
  <div class="card">
    <header class="card-header">
      <div class="media-left">
        <figure class="image is-64x64">
          <img v-bind="{ src: es.activeHexImage }" />
        </figure>
      </div>
      <p class="modal-card-title">{{ es.title }}</p>
    </header>
    <div class="card-content">
      <div class="card" v-if="es.selectedHexCount==1">
        <header class="card-header has-background-primary">
          <p class="card-header-title">Hex Details</p>
        </header>
        <div class="card-content">
          <TextEditor
            v-model="activeHex(es.activeHexes[0]).content"
            v-bind:editable="es.activeHexes.length == 1"
          />
        </div>
      </div>
      <div class="card">
        <header
          class="card-header has-background-primary"
          @click="es.toggleSection('terrain')"
        >
          <p class="card-header-title">Terrain</p>
          <i class="fa fa-angle-down"></i>
        </header>
        <div class="card-content" v-bind:class="{ 'is-hidden': es.terrainSectionHidden }">
          <div class="columns is-multiline">
            <div
              class="box"
              v-for="(terrainProperties, terrainName) in es.terrainToImage"
              v-bind:class="{ 'has-background-light': terrainProperties.selected }"
              @click="es.selectTerrain(terrainName)"
            >
              <img class="terrain-picker-hex" v-bind="{ src: terrainProperties.file }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
