<template>
  <div class="test-card-activity" :class="{ chunk: isChunk }">
    <TestCardActivityMultiple v-if="questionType === 'multiple'" />
    <TestCardActivityTyping v-else-if="questionType === 'typing'" />
    <TestCardActivitySentence v-else-if="questionType === 'sentence'" />
    <div class="size-full flex-center" v-else>지원하지 않는 유형입니다.</div>
  </div>
</template>

<script setup lang="ts">
const { question } = useTest();

const questionType = computed(() => question.value.type);
const isChunk = computed(() => question.value.method === 'chunk');
</script>
