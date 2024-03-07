<template>
  <div class="test-activity-bottom-progress">
    <CommonBarTimer
      :duration="testDuration"
      :hurryTime="testDuration * 0.75"
      :isBarRed="isIncorrect"
      @end="endProgress"
    />

    <div class="test-activity-bottom-progress-text keyboard-text">
      정답을 생각한 후 시작하세요 (스페이스 키)
    </div>
  </div>
</template>

<script setup lang="ts">
import { TEST_DURATION_WORD, TEST_DURATION_SENTENCE } from '@/constants/test';

const emits = defineEmits(['done']);

const props = defineProps<{ type: string }>();
const { type } = toRefs(props);
const { isAnswered, isIncorrect, isSentenceBook, checkAnswer } = useTest();
const { startTimer, stopTimer, resetTimer } = useTimer();

const testDuration = isSentenceBook.value
  ? TEST_DURATION_SENTENCE
  : TEST_DURATION_WORD;

const endProgress = () => {
  if (type?.value === 'preview') {
    setTimeout(() => {
      emits('done');
    }, 250);
  } else if (type?.value === 'activity') {
    checkAnswer();
  }
};

watch(
  () => type?.value,
  () => {
    resetTimer();
    startTimer();
  }
);

watch(
  () => isAnswered?.value,
  () => {
    if (isAnswered.value) stopTimer();
  }
);
</script>
