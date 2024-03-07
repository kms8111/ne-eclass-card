<template>
  <div class="study-card" :class="bookType">
    <StudyCardElementKnown v-if="isCompleted" />
    <StudyCardElementTryAgain v-else-if="isIncorrect" />

    <StudyCardWord
      v-if="bookType === 'word'"
      :question="question"
      :questionIndex="questionIndex"
      :isShowMeaning="isShowMeaning"
      :isShowHint="isShowHint"
      @checkWord="emits('checkWord')"
      @showHint="emits('showHint')"
    />

    <StudyCardSentence
      v-else-if="bookType === 'sentence'"
      :question="question"
      :questionIndex="questionIndex"
      :isShowMeaning="isShowMeaning"
      :isShowHint="isShowHint"
      @checkWord="emits('checkWord')"
      @showHint="emits('showHint')"
    />
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord', 'showHint']);

const { question, questionIndex, isShowMeaning, isShowHint } = defineProps<{
  question: Question;
  questionIndex: number;
  isShowMeaning: boolean;
  isShowHint: boolean;
}>();

const studyStore = useStudyStore();

const { bookType } = storeToRefs(studyStore);
const { isCompleted, isIncorrect } = useStudy();
</script>
