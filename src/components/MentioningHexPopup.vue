<script setup>

import TextEditor from "@/components/TextEditor.vue";
import { useEditorStore } from "@/stores/editor";

const es = useEditorStore();

</script>

<template>

<TextEditor v-model="es.currentSelectedContent" />

</template>