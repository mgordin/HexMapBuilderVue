<script setup>

import TextEditor from "@/components/TextEditor.vue";

const props = defineProps({
  content: {
    type: Object,
    default: null
  }
})

</script>

<template>

<div class="popupContent">
  <TextEditor :modelValue="content" />
</div>

</template>

<style>

.popupContent {
    width: 20vw;
    z-index: 999;
}

</style>