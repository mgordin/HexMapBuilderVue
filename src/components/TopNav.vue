<script setup>
import { useEditorStore } from "@/stores/editor";
import { useHexesStore } from "@/stores/hexes";
import 'remixicon/fonts/remixicon.css'

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
                </div>
            </div>
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Save / Load</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.exportMap">Export map to file</a>
                    <a class="navbar-item" @click="hs.loadMap">Load map from file</a>
                </div>
            </div>
        </div>
        <div class="navbar-end">
        </div>
    </nav>
</template>



<style>

</style>