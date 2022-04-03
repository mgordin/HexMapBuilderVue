<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";
import Multiselect from '@vueform/multiselect'

const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
const hexByUUID = hs.hexByUUID;
</script>

<template>
  <div class="sidebar-main has-shadow">
    <button class="button" @click="hs.makeHexForTesting(es.activeRow)">Make a hex - right</button>
    <button class="button" @click="hs.makeHexForTestingLeft(es.activeRow)">Make a hex - left</button>
    <input class="input" v-model="es.activeRow" />
    <button class="button" @click="hs.initializeMapForTesting">
      Set up 8x8 blank hexes
    </button>
    <button class="button" @click="es.deselectAllHexes">Deselect all</button>
    <button class="button" @click="hs.logHexes">Useful console log button (hexes)</button>
    <button class="button" @click="hs.logTracking">Useful console log button (tracking)</button>
    <button class="button" @click="hs.changeHex11Name">Change hex 1-1 id</button>
    <button class="button" @click="es.logInitializeMapModelShown">Log show modal</button>
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
                  <p class="card-header-title">Hex Tags</p>
              </header>
              <div class="card-content">
                  <Multiselect
                      v-model="hexByUUID(es.activeHexes[0]).tags"
                      mode="tags"
                      :close-on-select="false"
                      :searchable="true"
                      :create-option="false"
                      placeholder="Select location tags..."
                      :options="hs.sampleLocations"
                      />
              </div>
          </div>
        <div class="card" v-if="es.selectedHexCount==1">
          <header class="card-header has-background-primary">
            <p class="card-header-title">Hex Details</p>
          </header>
          <div class="card-content">
            <TextEditor
              v-model="hexByUUID(es.activeHexes[0]).content"
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
  </div>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>

<style>

.sidebar-main {
  height: 100vh;
  overflow-y: scroll;
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.sidebar-main::-webkit-scrollbar {
  display: none;
}

</style>
