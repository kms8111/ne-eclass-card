<template>
  <div class="placeholder-text" v-html="text"></div>
</template>

<script setup lang="ts">
const { text } = defineProps<{
  text: string;
}>();
</script>
