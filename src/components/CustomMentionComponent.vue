<template>
  <node-view-wrapper class="custom-mention-component" as="span">
    <span @click="es.selectHex(hexByUUID(node.attrs.uuid), {'shiftKey': false})"> {{ hexByUUID(node.attrs.uuid).id }} </span>
  </node-view-wrapper>
</template>

<script setup>
import { useHexesStore } from "@/stores/hexes";
import { useEditorStore } from '@/stores/editor'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const hs = useHexesStore();
const hexByUUID = hs.hexByUUID;

const es = useEditorStore()

const props = defineProps({
  nodeViewProps: nodeViewProps})

</script>

<style>

.custom-mention-component {
  cursor: pointer;
}

.custom-mention-component:hover {
  background-color: hsl(0, 0%, 21%);
  color: white;
}

</style>