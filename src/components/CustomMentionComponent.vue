<template>
  <node-view-wrapper class="custom-mention-component" as="span">
    <span> {{ hexByUUID(node.attrs.uuid).id }} </span>
  </node-view-wrapper>
</template>

<script setup>
import { useHexesStore } from "@/stores/hexes";
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const hs = useHexesStore();
const hexByUUID = hs.hexByUUID;

const props = defineProps({
  nodeViewProps: nodeViewProps})

</script>