<template>
  <div>{{title}}</div>
  <button @click="largeFont">放大</button>
  <slot/>
</template>

<script setup>

import { defineEmits, defineProps } from 'vue'

defineProps(['title'])

const emit = defineEmits(['largeFont'])
const largeFont = () =>  {
  let params = {
    a:3
  }
  emit('largeFont',params)
}

</script>
