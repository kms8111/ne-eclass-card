<template>
  <div
    class="answer-mark"
    :class="{
      small: isSmall,
      border: isBorder,
      correct: isCorrect,
      incorrect: isIncorrect,
    }"
  />
</template>

<script setup lang="ts">
const { isSmall, isBorder, isCorrect, isIncorrect } = defineProps({
  isSmall: Boolean,
  isBorder: Boolean,
  isCorrect: Boolean,
  isIncorrect: Boolean,
});
</script>
