<template>
  <template v-if="isMemorize">
    <CommonPlaceholderText
      v-if="!isChecked && chunkAnswers.length <= 0"
      text="의미를 보고 단어를 순서대로 선택하세요.<br />
            틀려도 계속할 수 있습니다."
    />

    <div class="study-card-question__text">
      <div class="chunk-answers">
        <span v-for="(chunkAnswer, index) in chunkAnswers" :key="index">
          {{ chunkAnswer }}
        </span>
      </div>
    </div>
  </template>

  <template v-else-if="isRecall">
    <div class="study-card-question__text">
      <div class="study-card-question__blank">
        <span
          v-for="(chunk, index) in question.blankChunks"
          :class="{
            blank: chunk === STUDY_BLANK_TEXT,
            correct: chunk === STUDY_BLANK_TEXT && isCompleted,
            incorrect: chunk === STUDY_BLANK_TEXT && isIncorrect,
          }"
        >
          {{ getBlankChunk(index) }}
        </span>
      </div>
    </div>
  </template>

  <template v-else-if="isSpell">
    <StudyCardQuestionAudio v-if="isAudioStudy" :audio="question.audio" />

    <template v-else-if="isChunkStudy">
      <CommonPlaceholderText
        v-if="!isChecked && chunkAnswers.length <= 0"
        text="의미를 보고 단어를 순서대로 선택하세요.<br />
            틀려도 계속할 수 있습니다."
      />

      <div class="study-card-question__text">
        <div v-if="isChecked" class="chunk-answers">
          <span
            v-for="(correctAnswer, index) in correctAnswers"
            :key="index"
            :class="getChunkClass(index)"
          >
            {{ correctAnswer }}
          </span>
        </div>

        <div v-else class="chunk-answers">
          <span v-for="(chunkAnswer, index) in chunkAnswers" :key="index">
            {{ chunkAnswer }}
          </span>
        </div>
      </div>
    </template>

    <div v-else class="study-card-question__text">
      {{ question[studyAnswerKey] }}
    </div>
  </template>
</template>

<script setup lang="ts">
import { STUDY_BLANK_TEXT } from '~/constants/study';
import type { Question } from '~/types/study';

const { question } = defineProps<{
  question: Question;
}>();

const { getQuestionData } = useQuestion();
const {
  selectedAnswers,
  chunkAnswers,
  correctAnswers,
  studyAnswerKey,
  isMemorize,
  isRecall,
  isSpell,
  isChecked,
  isIncorrect,
  isAudioStudy,
  isChunkStudy,
} = useStudy();

const questionData = computed(() => getQuestionData(question.cardId));
const isCompleted = computed(() => questionData.value?.isCompleted || false);

const getBlankChunk = (chunkIndex: number) => {
  const blankChunks = question.blankChunks || [];
  const blankIndexes = blankChunks
    .map((chunk, index) => (chunk === STUDY_BLANK_TEXT ? index : -1))
    .filter(index => index > -1);
  const chunk = blankChunks[chunkIndex];
  const isBlank = blankIndexes.includes(chunkIndex);

  if (isBlank) {
    const blankIndex = blankIndexes.findIndex(index => index === chunkIndex);
    const answer = selectedAnswers.value?.[blankIndex];
    const isBlankAnswered = !!answer;
    return isBlankAnswered ? answer : chunk;
  } else {
    return chunk;
  }
};

const getChunkClass = (index: number) => {
  const chunkAnswer = chunkAnswers.value[index];
  const isCorrect = chunkAnswer === correctAnswers.value[index];

  return {
    correct: isChecked && isCorrect,
    incorrect: isChecked && !isCorrect,
  };
};

// const getChunkAnswer = (index: number) => {
//   const chunkAnswer = chunkAnswers.value[index];

//   if (isChecked) {
//     const isAnswered = !isEmptyString(chunkAnswer);
//     const isCorrect = chunkAnswer === correctAnswers.value[index];
//     return

//   } else return chunkAnswer;
// };
</script>
