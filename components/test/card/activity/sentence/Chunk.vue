<template>
  <div
    class="test-card__chunk"
    :class="{ correct: isCorrect, incorrect: isIncorrect }"
  >
    <div class="test-card__chunk-top">
      <CommonPlaceholderText
        v-if="chunkAnswers.length <= 0"
        text="의미를 보고 단어를 순서대로 선택하세요."
      />

      <div class="test-card__chunk-text">
        <div class="chunk-answers">
          <span v-for="(chunkAnswer, index) in chunkAnswers" :key="index">
            {{ chunkAnswer }}
          </span>
        </div>
      </div>
    </div>

    <div class="test-card__chunk-bottom">
      <div class="test-card__translation">
        {{ translation }}
      </div>

      <div v-if="!isAnswered" class="test-card__chunks">
        <CommonWordChunks
          :chunks="chunks"
          :incorrectAnimations="incorrectAnimations"
          @onSelect="handleSelectChunk"
        />
      </div>
    </div>

    <CommonAnswerMark
      v-if="isAnswered"
      :isCorrect="isCorrect"
      :isIncorrect="isIncorrect"
    />
  </div>
</template>

<script setup lang="ts">
const {
  questionData,
  correctAnswers,
  chunkAnswers,
  isAnswered,
  isCorrect,
  isIncorrect,
  selectChunk,
  checkAnswer,
} = useTest();
const { playSound } = useAudio();

const incorrectAnimations = ref<number[]>([]);
const chunks = computed(() => {
  return questionData.value!.answers.filter(
    answer => !chunkAnswers.value.includes(answer)
  );
});
const translation = computed(() => questionData.value!.meaning);

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

    if (isComplete) checkAnswer();
  } else {
    playSound('incorrect');
    checkAnswer();
  }
};
</script>
