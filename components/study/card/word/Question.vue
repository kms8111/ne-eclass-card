<template>
  <div
    class="study-card-question"
    :class="{
      'study-card-audio': isAudioStudy,
      'study-card-example': studyMethod === 'example',
      'text-success': isCompleted,
      shake: isIncorrect,
    }"
  >
    <StudyCardWordQuestionContent :question="question" />

    <div
      v-if="isCompleted"
      class="study-card-question-animation"
      :class="{ 'text-success': isCompleted }"
    >
      <StudyCardWordQuestionContent :question="question" />
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

const studyStore = useStudyStore();
const { studyMethod } = storeToRefs(studyStore);
const { isAudioStudy } = useStudy();
</script>
