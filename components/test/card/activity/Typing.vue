<template>
  <div class="test-card__typing">
    <div class="test-card__typing-wrap">
      <div class="test-card__typing-label">단어입력</div>
      <div class="test-card__typing-input">
        <CommonActivityInput
          ref="inputRef"
          placeholder="단어를 입력하세요"
          :isCorrect="isAnswered && !isIncorrect"
          :isIncorrect="isIncorrect ?? false"
          :isReadonly="isAnswered"
          :value="inputValue"
          @change="handleChangeAnswer"
          @keyup.enter="handleSubmit"
        />
      </div>

      <div class="test-card__typing-btn">
        <CommonActivityButton
          isSmall
          label="제출"
          keyboardText="Enter"
          severity="help"
          :disabled="isAnswered"
          @click="handleSubmit"
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
const { isAnswered, isCorrect, isIncorrect, updateAnswer, checkAnswer } =
  useTest();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');

const handleChangeAnswer = (e: Event) => {
  const target = e.target as HTMLInputElement;
  inputValue.value = target.value;
  updateAnswer(inputValue.value);
};

const handleSubmit = () => {
  if (isAnswered.value) return;
  updateAnswer(inputValue.value);
  setTimeout(checkAnswer, 1);
};

// Focus 처리
const handleFocus = () => {
  setTimeout(() => inputRef.value?.focus(), 150);
};

onMounted(handleFocus);

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  if (keyName === 'enter') {
    handleSubmit();
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
