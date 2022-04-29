<script setup>
import { useHexesStore } from '@/stores/hexes'
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const es = useEditorStore();
</script>



<template>
<div class="modal" v-bind:class="{'is-active': es.settingsOpen}">
    <div class="modal-background"></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <button class="delete" aria-label="close" @click="es.toggleSettingsModal"></button>
        </header>
        <section class="modal-card-body">
            <label class="checkbox">
                <input type="checkbox" v-model="es.showTerrainsAsPanel">
                Use panels instead of dropdowns for terrain and icon
            </label>
        </section>
        <footer class="modal-card-foot">
            
        </footer>
    </div>
</div>
</template>



<style>

</style>