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
            <a class="navbar-item" href="https://bulma.io">
                <img src="/HexMapMakerLogoLight.png" height="60">
            </a>
        </div>
        <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Useful Buttons</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="hs.logHexes">Log hexes</a>
                    <a class="navbar-item" @click="hs.fillMap('temperate forest', 4, 4)">Generate terrain!</a>
                    <a class="navbar-item" @click="hs.logHexDistances()">Calculate distance between selected hexes</a>
                </div>
            </div>
        </div>
        <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link">Save / Load</a>
                <div class="navbar-dropdown">
                    <a class="navbar-item" @click="">Export map to file</a>
                    <a class="navbar-item" @click="">Save to browser storage</a>
                    <a class="navbar-item" @click="">Load map from file</a>
                    
                </div>
            </div>
        </div>
    </nav>
</template>



<style>

</style>