<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import { useEditorStore } from '@/stores/editor'
import { useHexesStore } from '@/stores/hexes'
import Sidebar from '@/components/Sidebar.vue'
import Hexmap from '@/components/Hexmap.vue'

</script>

<template>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
  <div class="columns">
            <div class="column is-one-quarter">
              <Sidebar />
            </div>
            <div class="column">
              <Hexmap />
            </div>
  </div>
</template>

<style>
  @import '@/assets/base.css';
</style>
