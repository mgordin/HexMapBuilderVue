<script setup>
import Sidebar from '@/components/Sidebar.vue'
import SidebarTerrainPainter from '@/components/SidebarTerrainPainter.vue'
import Hexmap from '@/components/Hexmap.vue'
import { useEditorStore } from "@/stores/editor";

const es = useEditorStore();

</script>

<template>
<div class="columns is-gapless">
    <div class="column is-one-quarter has-background-white">
        <Sidebar v-if="es.currentTool == 'hex-editor'"/>
        <SidebarTerrainPainter v-if="es.currentTool == 'terrain-painter'"/>
    </div>
    <div class="column scroll-column">
        <Hexmap />
    </div>
</div>
</template>