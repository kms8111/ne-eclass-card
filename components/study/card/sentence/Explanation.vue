<template>
  <div class="study-card-explanation">
    <div v-if="isCorrectAnswer" class="study-card-explanation__answer">
      <CommonTextBadge type="correct" label="정답" />
      <div class="study-card-explanation__answer__text text-success">
        {{ answerText }}
      </div>
    </div>

    <div class="study-card-explanation__translation">
      {{ question.meaning }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const { question, isCorrectAnswer } = defineProps<{
  question: Question;
  isCorrectAnswer: boolean;
}>();

const answerText = computed(() => question.correctAnswers.join(' '));
</script>
