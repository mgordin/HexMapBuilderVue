<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import TextEditor from "@/components/TextEditor.vue";
import Multiselect from '@vueform/multiselect'
import 'remixicon/fonts/remixicon.css'

import MentioningHexPopup from "@/components/MentioningHexPopup.vue";

import vSelect from 'vue-select'
import "vue-select/dist/vue-select.css";

import MentionedByTag from "@/components/MentionedByTag.vue"
import MentionedByTag2 from "@/components/MentionedByTag2.vue"
import MentionedByTagPopper from "@/components/MentionedByTagPopper.vue"



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
                  <MentionedByTagPopper v-for="hex in es.mentioningHexes" :hex="hex" />
              </div>
            </div>
          </div>
        </div>
        <!-- Text section -->
        <div class="block" v-if="es.selectedHexCount==1">
          <div class="card">
            <header class="card-header has-background-primary">
              <p class="card-header-title">Hex Details</p>
              <span class="icon randomize" title="Randomize description again with current tags" @click="hs.rerandomizeHexes('description')">
                  <i class="ri-magic-fill ri-xl"></i>
                </span>
              <span class="icon details" title="Collapse section" @click="es.toggleSection('text')">
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
            <header class="card-header has-background-primary">
                <p class="card-header-title">Hex Tags</p>
                <span class="icon randomize" title="Randomize tags and description again" @click="hs.rerandomizeHexes('tags+description')">
                  <i class="ri-magic-fill ri-xl"></i>
                </span>
                <span class="icon details" @click="es.toggleSection('tags')">
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
        <!-- Terrain section as panel -->
        <div class="block">
          <div class="card">
            <header class="card-header has-background-primary">
              <p class="card-header-title">Terrain</p>
              <span class="icon randomize" title="Randomize terrain again" @click="hs.rerandomizeHexes('terrain')">
                  <i class="ri-magic-fill ri-xl"></i>
                </span>
              <span class="icon details" @click="es.toggleSection('terrain')">
                  <i class="ri-arrow-left-s-line ri-xl" v-if="!es.terrainSectionVisible"></i>
                  <i class="ri-arrow-down-s-line ri-xl" v-if="es.terrainSectionVisible"></i>
              </span>
            </header>

            <!-- If the terrain is being shown as a panel -->
            <div class="card-content" v-if="es.terrainSectionVisible && es.showTerrainsAsPanel">
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

            <!-- If the terrain is being shown as a dropdown -->
            <div class="card-content" v-if="es.terrainSectionVisible && !es.showTerrainsAsPanel">
              <v-select v-model="hexByUUID(es.activeHexes[0]).terrain" :options="es.terrainDropdownOptions" :reduce="terrain => terrain.label">
                <template #option="{label, file}">
                  <span class="terrain-dropdown-option">
                    <img class="terrain-picker-hex" v-bind="{src: file}"/>
                    <span class="terrain-dropdown-text">{{label}}</span>
                  </span>
                </template>
              </v-select>
            </div>
          </div>
        </div>

        <!-- Icon section as panel -->
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
                  class="box icon-picker-container"
                  v-for="(iconProperties, iconName) in es.iconProperties"
                  v-bind:class="{ 'has-background-light': iconProperties.selected }"
                  @click="es.selectIcon(iconName)"
                  :title="iconName"
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

</style>
