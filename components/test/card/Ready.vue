<template>
  <div class="test-card-ready">
    <div class="test-card-ready-header">
      <!-- 상단이 허전해 선생님 프로필 대신 테스트 타입 노출 -->
      <div class="test-card-ready-header-text">
        {{ bookType === 'word' ? '단어' : '문장' }} 테스트
      </div>

      <div
        v-if="isIncorrectOnlyTest"
        class="test-card-ready-header-only-incorrect"
      >
        [직전 오답만 풀기]
      </div>

      <!-- 기획상 선생님 프로필 노출하지 않음 -->
      <!-- <div class="test-card-ready-header-avatar">
        <img src="@/assets/images/default-avatar.png" alt="Teacher avatar" />
      </div>
      <div class="test-card-ready-header-title">능률 닉네임 선생님 출제</div> -->
    </div>

    <div class="test-card-ready-body">
      <div v-if="isOverLimitCount" class="test-card-ready-body-title">
        <span class="text-primary">테스트 종료</span>
      </div>

      <div v-else class="test-card-ready-body-title">
        <strong class="test-card-ready-body-title-count">
          {{ testTryCount }}차
        </strong>
        <span class="test-card-ready-body-title-text">테스트</span>
      </div>

      <div class="test-card-ready-body-history">
        <div
          class="test-card-ready-body-history-item"
          v-for="(historyInfo, index) in testHistories"
          :key="index"
        >
          <span class="text-success">
            <i class="pi pi-check"></i>
          </span>

          <div class="test-card-ready-body-history-item-datetime">
            {{ parseTimestamps(historyInfo.studiedAt) }}
          </div>
          <div class="test-card-ready-body-history-item-score">
            {{ historyInfo.score }}점
          </div>
        </div>
      </div>

      <div
        v-if="isOverLimitCount"
        class="test-card-ready-body-subtitle text-danger"
      >
        {{ testLimitCount }}번의 응시기회를 모두 소진하셨습니다.
      </div>

      <div v-else class="test-card-ready-body-subtitle">
        {{ testLimitCount }}번의 응시기회 중 {{ testTryCount }}번째 도전입니다.
      </div>
    </div>

    <div class="test-card-ready-bottom">
      <CommonActivityButton
        v-if="isOverLimitCount"
        label="나가기"
        severity="danger"
        @click="exitStudy()"
      />

      <CommonActivityButton
        v-else
        label="다음"
        severity="success"
        @click="emits('moveNext')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['moveNext']);

const { testTryCount, testHistories, isIncorrectOnlyTest } = useTest();
const { testLimitCount } = useSetting();
const { bookType, exitStudy } = useStudy();
const isOverLimitCount = computed(
  () => testTryCount.value > testLimitCount.value
);
</script>
