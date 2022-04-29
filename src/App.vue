<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHexesStore } from '@/stores/hexes'
import Sidebar from '@/components/Sidebar.vue'
import Hexmap from '@/components/Hexmap.vue'
import InitializeMapModal from './components/InitializeMapModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import LoadMapModal from './components/LoadMapModal.vue';
import SaveNameModal from './components/SaveNameModal.vue';
import TopNav from '@/components/TopNav.vue'
import { useMagicKeys, whenever } from '@vueuse/core'




const es = useEditorStore();
const hs = useHexesStore();

const keys = useMagicKeys()

const { ctrl_s } = useMagicKeys({
  passive: false,
  onEventFired(e) {
    if (e.ctrlKey && e.key === 's' && e.type === 'keydown')
      e.preventDefault()

  },
})

whenever(ctrl_s, () => es.saveMapLocally())


</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <InitializeMapModal />
  <SettingsModal />
  <LoadMapModal />
  <SaveNameModal />
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
