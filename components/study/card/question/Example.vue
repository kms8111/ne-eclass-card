<template>
  <div class="study-card-example" v-html="getExampleHtml(example)"></div>
</template>

<script setup lang="ts">
const { example } = defineProps<{
  example: string;
}>();

const getExampleHtml = (example: string) => {
  const studyHtml = example
    .replace(/\{(\w+)\}/g, (match, word) => '_'.repeat(word.length))
    .replace(/\r\n/g, '<br/>');

  return studyHtml;
};
</script>
