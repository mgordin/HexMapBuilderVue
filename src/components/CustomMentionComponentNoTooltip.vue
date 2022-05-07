<template>
  <node-view-wrapper class="custom-mention-component-no-tooltip" as="span">
      <span 
        class="hex-mention"
        @mouseenter="show"
        @focus="show"
        @blur="hide"
        @mouseleave="hide"
        @click="es.selectHex(mentionedHex, {'shiftKey': false})"
      > 
        {{ mentionedHex.id }} 
      </span>
  </node-view-wrapper>
</template>

<script setup>
import { useHexesStore } from "@/stores/hexes";
import { useEditorStore } from '@/stores/editor'
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import { computed } from 'vue'


const hs = useHexesStore();
const hexByUUID = hs.hexByUUID;

const es = useEditorStore()

const props = defineProps({
  nodeViewProps: nodeViewProps,
  node: {
    type: Object,
    required: true,
  }
})


const mentionedHex = computed(() => hexByUUID(props.node.attrs.uuid))
console.log('mentioned hex no tooltip', mentionedHex)

</script>

<style>

.custom-mention-component-no-tooltip {
  cursor: pointer;
}

.custom-mention-component-no-tooltip:hover {
  background-color: hsl(0, 0%, 21%);
  color: white;
}

</style>