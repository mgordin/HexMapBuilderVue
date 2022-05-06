<template>
<VTooltip>
  <span class="tag is-medium">{{hex.id}}</span>

  <template #popper>
    <MentioningHexPopup2 :content="hex.content"/>
  </template>
</VTooltip>
</template>


<script setup>
import { useEditorStore } from "@/stores/editor";
import SampleComponent from "@/components/SampleComponent.vue";
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue";


const props = defineProps({
  hex: {
        type: Object
      }
  })
  
</script>


<style>

</style>