<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import 'remixicon/fonts/remixicon.css';
import Multiselect from '@vueform/multiselect';


const es = useEditorStore();
const hs = useHexesStore();

function logHTML() {
    var d = document.getElementById('hex-container-view');
    console.log(d)
    d = document.getElementById('hexDetailReader');
    console.log(d)
    d = document.getElementsByTagName('img')
    console.log(d)
}

function scrollWin() {
  document.getElementById('hex-container').scroll(0, 300);
  console.log('scroll?')
}

</script>

<template>
    <nav class="navbar is-dark has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://github.com/mgordin/HexMapBuilderVue">
                <img src="/HexMapMakerLogoLight.png" height="60">
            </a>
        </div>
        <div class="navbar-start">
            <div class="navbar-item has-text-grey-darker" v-if="es.mode=='edit'">
                <Multiselect
                    v-model="es.currentTool"
                    class="multiselect-css"
                    :mode="single"
                    :canClear="false"
                    :canDeselect="false"
                    :close-on-select="true"
                    :searchable="true"
                    :create-option="false"
                    placeholder="Select tool..."
                    :options="[
                        {'value': 'hex-editor', 'label': 'Hex editor', 'icon': './misc-images/hexagon.png'},
                        {'value': 'terrain-painter', 'label': 'Terrain painter', 'icon': './misc-images/paint-brush-line.png'}
                    ]"
                >
                    <template v-slot:singlelabel="{ value }">
                        <div class="multiselect-single-label">
                        <img class="label-icon" :src="value.icon"> {{ value.label }}
                        </div>
                    </template>

                    <template v-slot:option="{ option }">
                        <img class="option-icon" :src="option.icon"> {{ option.label }}
                    </template>
                </Multiselect>
            </div>
            <div class="navbar-item">
                <div class="tags has-addons modeSelector" @click="es.toggleViewMode">
                    <span class="tag" :class="{'is-primary': es.mode=='edit'}">Edit</span>
                    <span class="tag" :class="{'is-primary': es.mode=='view'}">View</span>    
                </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Save / Load</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.exportMap">Export map to file</a>
                    <a class="navbar-item" @click="hs.loadMap">Load map from file</a>
                    <hr class="dropdown-divider">
                    <a class="navbar-item" @click="es.saveMapLocally">Save map to local storage</a>
                    <a class="navbar-item" @click="es.toggleLoadModal">Load map from local storage</a>
                    <a class="navbar-item" @click="es.listAllStored">List stored to console</a>
                    <hr class="dropdown-divider">
                    <a class="navbar-item" @click="hs.exportMapImage(96, 110, 1)">Export to PNG</a>
                </div>
            </div>
            <a class="navbar-item" @click="es.toggleSettingsModal">Settings</a>
            <a class="navbar-item" @click="es.toggleInfoModal">Info</a>
            <a class="navbar-item" @click="logHTML">Log HTML</a>
            <a class="navbar-item" @click="scrollWin()">Scroll down</a>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Useful Buttons</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.logHexes">Log hexes</a>
                    <a class="navbar-item" @click="es.logActive">Log active hexes</a>
                    <a class="navbar-item" @click="hs.logLeftmostColumn">Log leftmost</a>
                </div>
            </div>
        </div>
        <div class="navbar-end">
            <div class="navbar-item save-indicator" v-if="es.savingIndicator">
                <i class="ri-save-fill ri-xl save-icon"></i>
                <p class="save-text"> Map Saved</p>
            </div>
            <div class="navbar-item">
                <a href="https://github.com/mgordin/HexMapBuilderVue" class="ri-github-fill ri-xl github-icon"></a>
            </div>
        </div>
    </nav>
</template>

<style src="@vueform/multiselect/themes/default.css"></style>


<style scoped>

.label-icon {
    padding-right: 10px;
}

.option-icon {
    padding-right: 10px;
}

.multiselect-css {
    min-width: 250px;
}

.github-icon {
    color: white;
}

.github-icon:hover {
    color: white;
    transform: scale(1.2);
}

.map-name {
    background-color: hsl(0, 0%, 21%);
    color: white;
    font-size: large;
}

.save-indicator {
    font-size: larger;
    color: turquoise;
}

.save-icon {
    margin-right: 10px;
    color: turquoise;
}

.save-text {
    color: turquoise;
}

.modeSelector {
    cursor: pointer;
}

</style>