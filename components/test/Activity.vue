<template>
  <div v-if="questionCount > 0" class="test-activity">
    <TestActivityTop />

    <div class="test-activity__content">
      <TestCard :type="activityCardType" v-auto-animate />
    </div>

    <div class="test-activity-bottom">
      <TestActivityTimer :type="activityCardType" @done="moveNext" />

      <div class="test-activity-bottom-btns">
        <CommonActivityButton
          v-if="activityCardType === 'preview'"
          label="시작하기"
          severity="help"
          @click="moveNext"
        />

        <CommonActivityButton
          v-else-if="activityCardType === 'activity'"
          label="다음문제"
          :severity="isAnswered ? 'help' : 'secondary'"
          :disabled="!isAnswered"
          @click="moveNext"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vAutoAnimate } from '@formkit/auto-animate';

const { playAudio } = useAudio();
const {
  question,
  questionIndex,
  questionCount,
  isAnswered,
  movePage,
  handleNext,
} = useTest();

const activityCardType = ref('preview');
const startQuestion = () => {
  activityCardType.value = 'preview';

  try {
    playAudio(question.value.audio);
  } catch (error) {
    console.log('startQuestion() - error', error);
  }
};

const moveNext = () => {
  if (activityCardType.value === 'preview') {
    activityCardType.value = 'activity';
  } else if (activityCardType.value === 'activity') {
    if (!isAnswered.value) return;
    else if (questionIndex.value < questionCount.value - 1) {
      handleNext();
    } else if (questionIndex.value === questionCount.value - 1) {
      movePage('complete');
    }
  }

  console.log('moveNext() - activityCardType.value', activityCardType.value);
};

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  if (keyName === 'space') moveNext();
};

useKeyStroke(true, handleKeyStroke);

// 문항 변경 시, 문항 재시작
watch(questionIndex, startQuestion);

// 문항 시작
watch(questionCount, () => {
  if (questionCount.value > 0) startQuestion();
});
</script>
