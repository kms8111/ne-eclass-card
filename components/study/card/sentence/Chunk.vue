<template>
  <div
    class="study-card__bottom-answer__chunk"
    :class="{
      question: !isChecked,
      answer: isChecked,
    }"
  >
    <template v-if="!isChecked">
      <div class="study-card__translation">
        {{ translation }}
      </div>

      <div class="study-card__chunks">
        <CommonWordChunks
          :chunks="question.answers"
          :selectedIndexes="selectedIndexes"
          :incorrectAnimations="incorrectAnimations"
          @onSelect="handleSelectChunk"
        />
      </div>
    </template>

    <div v-if="isChecked" class="study-card__answer">
      {{ translation }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord']);

const {
  question,
  translation,
  isChecked = false,
} = defineProps<{
  question: Question;
  translation: string;
  isChecked?: boolean;
}>();

const {
  chunkAnswers,
  correctAnswers,
  selectedIndexes,
  selectChunk,
  markAsKnown,
  isImmediateFeedback,
} = useStudy();
const { playSound } = useAudio();

const incorrectAnimations = ref<number[]>([]);

const animateIncorrect = (chunkIndex: number) => {
  incorrectAnimations.value.push(chunkIndex);
  setTimeout(() => {
    incorrectAnimations.value = incorrectAnimations.value.filter(
      index => index !== chunkIndex
    );
  }, 500);
};

const handleSelectChunk = (chunk: string, chunkIndex: number) => {
  const isCorrect = selectChunk(chunk, chunkIndex);

  if (isCorrect) {
    const isComplete =
      correctAnswers.value.length === chunkAnswers.value.length;
    if (isComplete) {
      markAsKnown(true);
      emits('checkWord');
    }
  } else {
    playSound('incorrect');

    if (isImmediateFeedback.value) {
      emits('checkWord');
      markAsKnown(false);
    } else {
      animateIncorrect(chunkIndex);
    }
  }
};
</script>
