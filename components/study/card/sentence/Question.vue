<template>
  <div
    class="study-card-question"
    :class="{
      'study-card-audio': isAudioStudy,
      'text-success': !isRecall && isCompleted,
      shake: isIncorrect,
    }"
  >
    <StudyCardSentenceQuestionContent :question="question" />

    <div
      v-if="isCompleted"
      class="study-card-question-animation"
      :class="{ 'text-success': isCompleted }"
    >
      <StudyCardSentenceQuestionContent :question="question" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const { question, isCompleted, isIncorrect } = defineProps<{
  question: Question;
  isCompleted: boolean;
  isIncorrect: boolean;
}>();

const { isRecall, isAudioStudy } = useStudy();
</script>
