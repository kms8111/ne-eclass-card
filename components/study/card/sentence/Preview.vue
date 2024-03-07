<template>
  <div class="study-card-preview">
    <div class="study-card-preview-text">
      {{ question[studyQuestionKey] }}
    </div>

    <div v-if="isShowTranslation" class="study-card-preview-translation">
      {{ question[studyAnswerKey] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const { question, isShowTranslation } = defineProps<{
  question: Question;
  isShowTranslation: boolean;
}>();

const { studyQuestionKey, studyAnswerKey } = useQuestion();
</script>
