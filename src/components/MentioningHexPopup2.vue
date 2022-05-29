<script setup>

import TextViewer from "@/components/TextViewer.vue";

const props = defineProps({
  hex: {
    type: Object,
  }
})

</script>

<template>

<div class="popupContent">
  <TextViewer :modelValue="hex.content" :showMentionTooltip="false" />
</div>

</template>

<style>

.popupContent {
    width: 20vw;
    z-index: 999;
}

</style>