<template>
  <TestCardActivitySentenceWriting
    v-if="method === 'writing' || method === 'dictation'"
  />
  <TestCardActivitySentenceChunk v-else />
</template>

<script setup lang="ts">
const { questionData } = useTest();

const method = questionData.value?.method;
</script>
