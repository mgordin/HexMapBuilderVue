<script setup>

const props = defineProps({
  someText: {
        type: String,
        default: 'default'
      }
  })

</script>

<template>
<span>This text</span>
</template>