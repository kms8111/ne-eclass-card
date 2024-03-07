import type { delay } from 'lodash';
<template>
  <div class="matching-activity">
    <div class="matching-activity-header">
      <div class="matching-activity-time">
        <div class="matching-activity-time-text">
          {{ currentTimeText }}
        </div>

        <div
          v-if="isShowHurryUp"
          class="matching-activity-hurry-up animate__animated animate__bounceInRight"
        >
          Hurry Up!
        </div>
      </div>

      <div class="matching-activity-score">
        <span class="label">Score</span>
        <span class="value">{{ currentScore }}</span>
      </div>
    </div>

    <div class="matching-activity-game">
      <div class="matching-activity-card matching-activity-left">
        <div
          class="matching-activity-card-item animate__animated animate__slideInLeft"
          :class="{
            selected: index === selectedWordIndex,
            correct: isShowFeedback && isCorrect,
            incorrect: isShowFeedback && !isCorrect,
          }"
          v-for="(wordInfo, index) in optionWords"
          :key="wordInfo.cardId"
          :style="addAnimationDelay(index)"
          @click="selectWord(index)"
        >
          <div class="matching-activity-card-item__content">
            {{ wordInfo.word }}
          </div>
          <div class="matching-activity-card-item__score">100</div>
        </div>

        <div v-if="isShowBlocker" class="matching-blocker" />
      </div>

      <div class="matching-activity-card matching-activity-right">
        <div
          class="matching-activity-card-item animate__animated animate__slideInRight"
          :class="{
            selected: index === selectedAnswerIndex,
            correct: isShowFeedback && isCorrect,
            incorrect: isShowFeedback && !isCorrect,
          }"
          v-for="(wordInfo, index) in optionAnswers"
          :key="wordInfo.cardId"
          :style="addAnimationDelay(index)"
          @click="selectAnswer(index)"
        >
          <div class="matching-activity-card-item__content">
            {{ wordInfo.meaning }}
          </div>
        </div>

        <div v-if="isShowBlocker" class="matching-blocker" />
      </div>
    </div>

    <div class="matching-activity-timer">
      <CommonBarTimer
        :duration="questionDuration"
        :hurryTime="questionDuration * 0.7"
        :delay="3000"
        @tick="changeCurrentTime"
        @end="handleTimeOver"
      />
    </div>

    <MatchingActivityReadyAnimation
      v-if="!isStarted"
      @complete="startMatching()"
    />
    <MatchingActivityTimeoutAnimation
      v-if="isShowTimeout"
      @complete="renewTimer()"
    />
  </div>
</template>

<script setup lang="ts">
import { MATCHING_HURRY_UP_DURATION } from '@/constants/matching';

const studyStore = useStudyStore();

const { movePage, exitStudy } = studyStore;
const {
  totalDuration,
  questionDuration,
  currentTime,
  currentTimeText,
  currentScore,
  changeCurrentTime,
  optionWords,
  optionAnswers,
  selectedWordIndex,
  selectedAnswerIndex,
  isShowFeedback,
  selectWord,
  selectAnswer,
  makeOptions,
  saveRecord,
} = useMatching();
const { startTimer, resetTimer, stopTimer, pauseTimer, resumeTimer } = useTimer(
  {
    onTick: changeCurrentTime,
  }
);
const { playSound } = useAudio();

const isStarted = ref(false);
const isShowTimeout = ref(false);
const isShowHurryUp = ref(false);
const isShowBlocker = computed(
  () => !isStarted.value || isShowTimeout.value || isShowFeedback.value
);
const isCorrect = computed(() => {
  const selectedWord = optionWords.value[selectedWordIndex.value];
  const selectedAnswer = optionAnswers.value[selectedAnswerIndex.value];
  return selectedWord.cardId === selectedAnswer.cardId;
});

const startMatching = () => {
  isStarted.value = true;
};

const renewTimer = () => {
  resetTimer();
  startTimer();
  isShowTimeout.value = false;
};

const handleTimeOver = () => {
  isShowTimeout.value = true;
};

const showHurryUp = () => {
  playSound('hurry-up');
  isShowHurryUp.value = true;
};

const endMatching = async () => {
  stopTimer();
  await saveRecord(currentScore.value);
  movePage('complete');
};

watch(currentTime, () => {
  if (currentTime.value >= totalDuration.value) {
    endMatching();
  } else if (currentTime.value >= MATCHING_HURRY_UP_DURATION) {
    if (!isShowHurryUp.value) showHurryUp();
  }
});

// options가 변경 되면 타이머 재시작
watch([optionWords, optionAnswers], () => {
  if (isStarted.value) renewTimer();
});

// isShowFeedback가 true일 때 타이머 정지
watch(isShowFeedback, () => {
  console.log('isShowFeedback', isShowFeedback.value);

  if (isShowFeedback.value) {
    pauseTimer();
  } else {
    resumeTimer();
  }
});

// 진입 시 문항 생성
makeOptions();
</script>
