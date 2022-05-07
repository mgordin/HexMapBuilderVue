<script setup>

import TextEditor from "@/components/TextEditor.vue";

const props = defineProps({
  hex: {
    type: Object,
  }
})

</script>

<template>

<div class="popupContent">
  <TextEditor :modelValue="hex.content" :showMentionTooltip="false" />
</div>

</template>

<style>

.popupContent {
    width: 20vw;
    z-index: 999;
}

</style>