<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHexesStore } from '@/stores/hexes'
import InitializeMapModal from './components/InitializeMapModal.vue';
import SettingsModal from './components/SettingsModal.vue';
import LoadMapModal from './components/LoadMapModal.vue';
import SaveNameModal from './components/SaveNameModal.vue';
import InfoModal from './components/InfoModal.vue';
import ExpandMapModal from './components/ExpandMapModal.vue';
import ViewModeLoader from './components/ViewModeLoader.vue';
import Attribution from './components/AttributionModal.vue';
import TopNav from '@/components/TopNav.vue'
import MapEditor from './components/MapEditor.vue'
import MapViewer from './components/MapViewer.vue'

import { useMagicKeys, whenever } from '@vueuse/core'
import { useEventListener } from '@vueuse/core'

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

useEventListener(document, 'mouseup', (evt) => { 
  if (es.mode == 'edit' && es.currentTool == 'terrain-painter') {
    hs.terrainPainterMapUpdate()
  }
 })

function ConfirmLeavingPage() {
  return window.confirm('Do you really want to leave the page?  Any unsaved changes will be lost.')
}

useEventListener(window, 'beforeunload', (evt) => { 
  if (!ConfirmLeavingPage()) {
    evt.preventDefault();
  }
  evt.returnValue = '';
 })
</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.4/css/bulma.min.css">
  <InitializeMapModal />
  <SettingsModal />
  <LoadMapModal />
  <SaveNameModal />
  <InfoModal />
  <ExpandMapModal />
  <Attribution />
  <ViewModeLoader />
  <TopNav />
  <MapEditor v-if="es.mode=='edit'"/>
  <MapViewer v-if="es.mode=='view'"/>
  
</template>

<style>
  @import '@/assets/base.css';

  
</style>
