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

</style>