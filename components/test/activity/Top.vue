<template>
  <div class="test-activity__top">
    <!-- 진행 개수 -->
    <span class="question-number text-white">
      <span class="known_count">{{ questionIndex + 1 }}</span>
    </span>

    <span class="text-gray">
      / <span class="total_count">{{ questionCount }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const { questionIndex, questionCount } = useTest();
</script>
