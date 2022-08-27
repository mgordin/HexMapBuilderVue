<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>



<template>
<div class="modal" v-bind:class="{'is-active': es.settingsOpen}">
    <div class="modal-background"></div>
    <div class="modal-card settings-panel">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <button class="delete" aria-label="close" @click="es.toggleSettingsModal"></button>
        </header>
        <section class="modal-card-body">
            <div class="block">
                <h1 class="title">Content Settings</h1>
                <label>
                Base fraction of hexed with content generated:  
                <input type="number" v-model="es.baseFractionWithContent">
                </label>
            </div>

            <div class="block">
                <h1 class="title">Display Settings</h1>
                <label class="checkbox">
                    <input type="checkbox" v-model="es.showTerrainsAsPanel">
                    Use panels instead of dropdowns for terrain and icon
                </label>
                <br/>
                <label>
                    Hex scale:  
                    <input type="number" v-model="es.hexScale">
                </label>
                <br/>
                <label class="checkbox">
                    <input type="checkbox" v-model="es.showHexLabels">
                    Show hex numbers
                </label>
            </div>

            <hr>

            <div class="block">
                <h1 class="title">Save Map Settings</h1>
                <label>Name to save map under</label>
                <input class="input" type="text" placeholder="Name to save map under" v-model="es.saveName">
            </div>

            <hr>
            <div class="block">
                <h1 class="title">Export to PNG Settings</h1>
                <div>
                    <label class="checkbox">
                        <input type="checkbox" v-model="es.mapExportAsPNGShowHexNumbers">
                        Show hex labels
                    </label>
                </div>
                <div>
                    <label class="checkbox">
                        <input type="checkbox" v-model="es.mapExportAsPNGShowHexIcons">
                        Show hex icons
                    </label>
                </div>
            </div>
            
        </section>
        <footer class="modal-card-foot">
            
        </footer>
    </div>
</div>
</template>



<style>

.settings-panel {
    min-height:75vh;
}

</style>