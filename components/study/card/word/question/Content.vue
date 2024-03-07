<template>
  <StudyCardQuestionAudio v-if="isAudioStudy" :audio="question.audio" />
  <StudyCardQuestionExample
    v-else-if="studyMethod === 'example'"
    :example="question[studyQuestionKey]"
  />
  <div v-else class="study-card-question__text">
    {{ question[studyQuestionKey] }}
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const { question } = defineProps<{
  question: Question;
}>();

const { studyMethod, studyQuestionKey, isAudioStudy } = useStudy();
</script>
