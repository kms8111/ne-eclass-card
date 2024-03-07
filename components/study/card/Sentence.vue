<template>
  <div
    class="study-card-sentence"
    :class="{
      'sentence-memorize': isMemorize,
      'sentence-preview': isCardPreview,
      'sentence-chunk': isChunkStudy,
    }"
  >
    <div class="study-card__top">
      <StudyCardElementControl
        v-if="!isAudioStudy"
        :question="question"
        :isTranslation="isCardPreview"
        :isShowTranslation="isShowTranslation"
        @toggleTranslation="toggleTranslation"
      />

      <StudyCardSentencePreview
        v-if="isCardPreview"
        :question="question"
        :isShowTranslation="isShowTranslation"
      />

      <StudyCardSentenceQuestion
        v-else
        :question="question"
        :isCompleted="isCompleted"
        :isIncorrect="isIncorrect ?? false"
      />
    </div>

    <div
      v-if="!isCardPreview"
      class="study-card__bottom"
      :class="{
        'no-border-top': isChecked && isChunkStudy,
      }"
    >
      <div class="study-card__bottom-answer">
        <StudyCardSentenceChunk
          v-if="isMemorize"
          :question="question"
          :translation="question[studyAnswerKey]"
          @checkWord="emits('checkWord')"
        />

        <StudyCardSentenceBlank
          v-else-if="isRecall"
          :question="question"
          :questionIndex="questionIndex"
          @checkWord="emits('checkWord')"
        />

        <template v-else-if="isSpell">
          <StudyCardSentenceChunk
            v-if="isChunkStudy"
            :question="question"
            :translation="question[studyAnswerKey]"
            :isChecked="isChecked"
            @checkWord="emits('checkWord')"
          />

          <StudyCardSentenceSpell
            v-else
            :question="question"
            :questionIndex="questionIndex"
            :isShowHint="isShowHint"
            @checkWord="emits('checkWord')"
            @showHint="emits('showHint')"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord', 'showHint']);

const { question, questionIndex, isShowHint } = defineProps<{
  question: Question;
  questionIndex: number;
  isShowHint: boolean;
}>();

const studyStore = useStudyStore();
const { isMemorize, isRecall, isSpell } = storeToRefs(studyStore);
const { studyAnswerKey, getQuestionData } = useQuestion();
const { isIncorrect, isCardPreview, isAudioStudy, isChunkStudy, isChecked } =
  useStudy();

const questionData = computed(() => getQuestionData(question.cardId));
const isCompleted = computed(() => questionData.value?.isCompleted || false);
const isShowTranslation = ref(false);
const toggleTranslation = () =>
  (isShowTranslation.value = !isShowTranslation.value);
</script>
