<template>
  <div
    class="test-card__writing"
    :class="{ correct: isCorrect, incorrect: isIncorrect }"
  >
    <div v-if="testMethod === 'dictation'" class="test-card__writing-question">
      <StudyButtonAudio :audio="questionData?.audio ?? ''" />

      <span>Listen Carefully</span>
    </div>

    <div v-else class="test-card__writing-question">
      {{ questionWord }}
    </div>

    <div class="test-card__writing-input">
      <CommonActivityInput
        ref="inputRef"
        placeholder=""
        :isMultipleLine="true"
        :isCorrect="isAnswered && !isIncorrect"
        :isIncorrect="isIncorrect ?? false"
        :isReadonly="isAnswered"
        :value="inputValue"
        @change="handleChangeAnswer"
      />

      <CommonAnswerMark
        v-if="isAnswered"
        :isCorrect="isCorrect"
        :isIncorrect="isIncorrect"
      />
    </div>

    <div v-if="!isAnswered" class="test-card__writing-btn">
      <CommonActivityButton
        isSmall
        label="제출"
        severity="help"
        :disabled="isAnswered"
        @click="handleSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  questionData,
  testMethod,
  questionWord,
  isAnswered,
  isCorrect,
  isIncorrect,
  updateAnswer,
  checkAnswer,
} = useTest();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');

const handleChangeAnswer = (e: Event) => {
  const target = e.target as HTMLInputElement;
  inputValue.value = target.value;
  updateAnswer(inputValue.value);
};

const handleSubmit = () => {
  if (isAnswered.value) return;
  checkAnswer();
};

// Focus 처리
const handleFocus = () => {
  setTimeout(() => inputRef.value?.focus(), 150);
};

onMounted(handleFocus);

// // Keyboard 입력 처리
// const handleKeyStroke = (keyName: string) => {
//   if (keyName === 'enter') {
//     handleSubmit();
//   }
// };

// useKeyStroke(true, handleKeyStroke);
</script>
