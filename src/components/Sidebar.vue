<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";
import Multiselect from '@vueform/multiselect'
import 'remixicon/fonts/remixicon.css'

const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
const hexByUUID = hs.hexByUUID;
</script>

<template>
  <div class="sidebar-main has-shadow">
    <!-- Real sidebar content -->
    <div class="card">
      <!-- Sidebar header -->
      <header class="card-header has-background-light">
        <div class="sidebar-header">
          <div class="media-left">
            <figure class="image sidebar-hex-image">
              <img v-bind="{ src: es.activeHexImage }" />
            </figure>
          </div>
          <p class="modal-card-title">{{ es.title }}</p>
        </div>

      </header>
      <!-- Sidebar section start here -->
      <div class="card-content">
        <!-- Tags section -->
        <div class="block" v-if="es.selectedHexCount==1">
          <div class="card">
            <header class="card-header has-background-primary" @click="es.toggleSection('tags')">
                <p class="card-header-title">Hex Tags</p>
                <span class="icon details">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.tagsSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.tagsSectionVisible"></i>
                </span>
            </header>
            <div class="card-content" v-if="es.tagsSectionVisible">
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
        </div>
        <!-- Text section -->
        <div class="block" v-if="es.selectedHexCount==1">
          <div class="card">
            <header class="card-header has-background-primary" @click="es.toggleSection('text')">
              <p class="card-header-title">Hex Details</p>
              <span class="icon details">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.textSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.textSectionVisible"></i>
              </span>
            </header>
            <div class="card-content" v-if="es.textSectionVisible">
              <TextEditor
                v-model="hexByUUID(es.activeHexes[0]).content"
                v-bind:editable="es.activeHexes.length == 1"
              />
            </div>
          </div>
        </div>
        <!-- Terrain section -->
        <div class="block">
          <div class="card">
            <header
              class="card-header has-background-primary"
              @click="es.toggleSection('terrain')"
            >
              <p class="card-header-title">Terrain</p>
              <span class="icon details">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.terrainSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.terrainSectionVisible"></i>
              </span>
            </header>
            <div class="card-content" v-if="es.terrainSectionVisible">
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

.details {
  left: -10px;
  top: 12px;
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


</style>
