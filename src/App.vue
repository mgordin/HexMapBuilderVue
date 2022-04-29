<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHexesStore } from '@/stores/hexes'
import InitializeMapModal from './components/InitializeMapModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import LoadMapModal from './components/LoadMapModal.vue';
import SaveNameModal from './components/SaveNameModal.vue';
import TopNav from '@/components/TopNav.vue'
import { useMagicKeys, whenever } from '@vueuse/core'
import MapEditor from './components/MapEditor.vue'

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
  <MapEditor/>
  
</template>

<style>
  @import '@/assets/base.css';
</style>
