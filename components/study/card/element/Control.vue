<template>
  <div class="study-card__top-control">
    <StudyButtonAudio :audio="question.audio" :isDisabled="isAudioDisabled" />
    <!-- 기획에서 북마크 사용하지 않음 -->
    <!-- <StudyButtonBookmark :questionId="question.cardId" /> -->
    <Button
      v-if="isTranslation"
      outlined
      size="small"
      severity="help"
      :label="isShowTranslation ? '뜻 감추기' : '뜻 보기'"
      @click="emits('toggleTranslation')"
    ></Button>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['toggleTranslation']);

const { question, isTranslation, isShowTranslation } = defineProps<{
  question: Question;
  isTranslation?: boolean;
  isShowTranslation?: boolean;
}>();

const { isAudioDisabled } = useStudy();
</script>
