<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHexesStore } from '@/stores/hexes'
import Sidebar from '@/components/Sidebar.vue'
import Hexmap from '@/components/Hexmap.vue'
import InitializeMapModal from './components/InitializeMapModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import TopNav from '@/components/TopNav.vue'


const es = useEditorStore();
const hs = useHexesStore();

</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <InitializeMapModal />
  <SettingsModal />
  <TopNav />
  <div class="columns is-gapless">
      <div class="column is-one-quarter has-background-white">
        <Sidebar />
      </div>
      <div class="column scroll-column">
        <Hexmap />
      </div>
  </div>
</template>

<style>
  @import '@/assets/base.css';
</style>
