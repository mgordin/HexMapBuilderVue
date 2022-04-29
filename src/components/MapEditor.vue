<script setup>
import Sidebar from '@/components/Sidebar.vue'
import Hexmap from '@/components/Hexmap.vue'
</script>

<template>
<div class="columns is-gapless">
    <div class="column is-one-quarter has-background-white">
        <Sidebar />
    </div>
    <div class="column scroll-column">
        <Hexmap />
    </div>
</div>
</template>