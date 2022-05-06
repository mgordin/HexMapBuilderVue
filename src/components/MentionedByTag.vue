<template>
  <Popper hover="true" arrow="true">
    <span class="tag is-medium">{{hex.id}}</span>
    <template #content>
      <MentioningHexPopup2 :content="hex.content"/>
    </template>
  </Popper>
</template>

<script setup>

import { useEditorStore } from "@/stores/editor";
import SampleComponent from "@/components/SampleComponent.vue"
import MentioningHexPopup2 from "@/components/MentioningHexPopup2.vue"

import Popper from "vue3-popper";

const props = defineProps({
  hex: {
        type: Object
      }
  })

</script>


<style>
:root {
  --popper-theme-background-color: #ffffff;
  --popper-theme-background-color-hover: #ffffff;
  --popper-theme-text-color: #333333;
  --popper-theme-border-width: 1px;
  --popper-theme-border-style: solid;
  --popper-theme-border-color: #606060;
  --popper-theme-border-radius: 6px;
  --popper-theme-padding: 32px;
  --popper-theme-box-shadow: 0 6px 30px -6px rgba(0, 0, 0, 0.25);
}

</style>