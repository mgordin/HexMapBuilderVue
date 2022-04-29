<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import 'remixicon/fonts/remixicon.css'
import vSelect from 'vue-select'
import "vue-select/dist/vue-select.css";
import Multiselect from '@vueform/multiselect'


const es = useEditorStore();
const hs = useHexesStore();

</script>



<template>
    <nav class="navbar is-dark has-shadow is-fixed-top" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-item" href="https://github.com/mgordin/HexMapBuilderVue">
                <img src="/HexMapMakerLogoLight.png" height="60">
            </a>
        </div>
        <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Useful Buttons</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.logHexes">Log hexes</a>
                    <a class="navbar-item" @click="es.logActive">Log active hexes</a>
                </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Save / Load</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.exportMap">Export map to file</a>
                    <a class="navbar-item" @click="hs.loadMap">Load map from file</a>
                    <a class="navbar-item" @click="es.saveMapLocally">Save map to local storage</a>
                    <a class="navbar-item" @click="es.toggleLoadModal">Load map from local storage</a>
                    <a class="navbar-item" @click="es.listAllStored">List stored to console</a>
                </div>
            </div>
            <a class="navbar-item" @click="es.toggleSettingsModal">Settings</a>
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



<style>

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

</style>