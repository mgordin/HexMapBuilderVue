<template>
<VTooltip hover="true" arrow="true">
    <span @click="es.selectHex(hexByUUID(node.attrs.uuid), {'shiftKey': false})"> {{ hexByUUID(node.attrs.uuid).id }} </span>
    <template #popper>
        <MentioningHexPopup2 :content="hexByUUID(node.attrs.uuid).content"/>
    </template>
</VTooltip>
</template>

<script setup>
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"
import { useHexesStore } from "@/stores/hexes";
import { useEditorStore } from '@/stores/editor'

const hs = useHexesStore();
const hexByUUID = hs.hexByUUID;

const es = useEditorStore()


defineProps({
    node: Object
})

</script>