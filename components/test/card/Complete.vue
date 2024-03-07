<template>
  <div class="test-card-complete">
    <div class="test-card-complete-top">
      <div class="test-card-complete-score">{{ score }}점이네요.</div>
      <div class="test-card-complete-goal">
        선생님의 목표점수({{ goalScore }})점에 재도전해보세요
      </div>
    </div>

    <div v-if="isCheckResult" class="test-card-complete-bottom">
      <CommonActivityButton
        label="다시 풀기"
        severity="help"
        @click="retryTest()"
      />

      <CommonActivityButton
        label="학습 나가기"
        severity="success"
        @click="endStudy(true)"
      />
    </div>

    <div v-else class="test-card-complete-bottom">
      <CommonActivityButton
        label="제출 결과 확인"
        severity="help"
        @click="handleShowResult()"
      />
    </div>

    <TestModalResult
      :goalScore="goalScore"
      :testTryCount="testTryCount"
      :questionDatas="questionDatas"
      v-model:isShow="isShowResult"
    />
  </div>
</template>

<script setup lang="ts">
const { settingInfo } = useSetting();
const { endStudy } = useStudy();
const {
  questionDatas,
  testTryCount,
  questionIndex,
  questionCount,
  correctCount,
} = useTest();

const isCheckResult = ref(false);
const isShowResult = ref(false);

const goalScore = computed(() => settingInfo.value?.test.goalScore || 0);
const score = computed(() => {
  const score = Math.floor((correctCount.value / questionCount.value) * 100);
  return isNaN(score) ? 0 : score;
});

const handleShowResult = () => {
  isShowResult.value = true;
  isCheckResult.value = true;
};

const retryTest = () => {
  questionIndex.value = 0;
  turnOffPreventClose();
  location.reload();
};
</script>
