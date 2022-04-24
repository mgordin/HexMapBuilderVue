<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";
import Multiselect from '@vueform/multiselect'
import 'remixicon/fonts/remixicon.css'

import MentioningHexPopup from "@/components/MentioningHexPopup.vue";
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/themes/light-border.css';


const es = useEditorStore();
const hs = useHexesStore();

const activeHex = hs.activeHex;
const hexByUUID = hs.hexByUUID;

</script>

<template>
  <div class="sidebar-main">
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
        <!-- Mentioned by section -->
        <div class="block" v-if="es.selectedHexCount==1">
          <div class="card">
            <header class="card-header has-background-primary" @click="es.toggleSection('mentioned-by')">
                <p class="card-header-title">Mentioned By</p>
                <span class="icon details">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.tagsSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.tagsSectionVisible"></i>
                </span>
            </header>
            <div class="card-content" v-if="es.mentionedBySectionVisible">
              <div class="tags">
                <span class="tag is-medium" 
                  v-for="hex in es.mentioningHexes" 
                  @mouseover="es.currentSelectedContent = hex.content"
                  @click="es.selectHex(hex, {shiftKey: false})"
                  v-tippy="{content: MentioningHexPopup,
                            theme: 'light-border',
                            placement: 'bottom'}"
                >
                  {{hex.id}}
                </span>
              </div>
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
                    :options="hs.tagList"
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

        <!-- Icon section -->
        <div class="block">
          <div class="card">
            <header
              class="card-header has-background-primary"
              @click="es.toggleSection('icons')"
            >
              <p class="card-header-title">Point of Interest</p>
              <span class="icon details">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.iconsSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.iconsSectionVisible"></i>
              </span>
            </header>
            <div class="card-content" v-if="es.iconsSectionVisible">
              <div class="columns is-multiline">
                <div
                  class="box"
                  v-for="(iconProperties, iconName) in es.iconProperties"
                  v-bind:class="{ 'has-background-light': iconProperties.selected }"
                  @click="es.selectIcon(iconName)"
                >
                  <img class="icon-picker" v-bind="{ src: iconProperties.file }" />
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

.terrain-picker-hex{
  height: 38px;
  width: 44px;
}

.icon-picker {
  height: 50px;
  width: 50px;
}

</style>
