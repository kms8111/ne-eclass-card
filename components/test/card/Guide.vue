<template>
  <div class="test-card-guide">
    <div class="test-card-guide-top">
      <div class="test-card-guide-top-line">
        <div class="test-card-guide-top-line-title">출제</div>
        <div class="test-card-guide-top-line-text">선생님</div>
      </div>

      <div class="test-card-guide-top-line">
        <div class="test-card-guide-top-line-title">문항수</div>
        <div class="test-card-guide-top-line-text text-success">
          <span
            class="test-question-count"
            v-for="(questionCount, key, index) in questionCountInfo"
          >
            {{ SETTING_TEST_QUESTION_TEXT_INFO[key] }}
            {{ questionCount }}문항{{
              // 마지막 문항이 아니면 쉼표 추가
              index !== Object.keys(questionCountInfo).length - 1 ? ', ' : ''
            }}
          </span>

          <span v-if="isIncorrectOnlyTest" class="text-white">
            [직전 오답 문항]
          </span>
        </div>
      </div>

      <div class="test-card-guide-top-line">
        <div class="test-card-guide-top-line-title">제한시간</div>
        <div
          v-if="testSettingInfo.answerSpeed"
          class="test-card-guide-top-line-text text-success"
        >
          {{ SETTING_TEST_ANSWER_SPEED_TEXT_INFO[testSettingInfo.answerSpeed] }}
        </div>
      </div>

      <div class="test-card-guide-top-line">
        <div class="test-card-guide-top-line-title">목표점수</div>
        <div class="test-card-guide-top-line-text text-success">
          {{ testSettingInfo.goalScore }}점
        </div>
      </div>

      <div class="test-card-guide-top-line">
        <div class="test-card-guide-top-line-title">응시횟수 제한</div>
        <div class="test-card-guide-top-line-text text-success">
          최대 {{ testLimitCount }}회
        </div>
      </div>
    </div>

    <div class="test-card-guide-body">
      <div class="test-card-guide-body-wrap text-success">
        <div class="test-card-guide-body-item">
          1. 제시어를 보고 미리 답을 생각하세요. 정답입력시간이 아주 짧아요.
        </div>
        <div class="test-card-guide-body-item">
          2. 도중에 중단해도 자동제출 됩니다.
        </div>
      </div>
    </div>

    <div class="test-card-guide-bottom">
      <CommonActivityButton
        label="테스트 시작"
        severity="success"
        @click="emits('moveNext')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  SETTING_TEST_QUESTION_TEXT_INFO,
  SETTING_TEST_ANSWER_SPEED_TEXT_INFO,
} from '~/constants/setting';

const emits = defineEmits(['moveNext']);

const { bookType } = useStudy();
const {
  testQuestionTypeInfos,
  incorrectQuestionTypeInfos,
  isIncorrectOnlyTest,
} = useTest();
const { testSettingInfo, testLimitCount } = useSetting();

// 문항 정보
const questionCountInfo = computed(() => {
  const targetQuestionInfos = isIncorrectOnlyTest.value
    ? incorrectQuestionTypeInfos.value
    : testQuestionTypeInfos.value;

  const groupKey = bookType.value === 'word' ? 'type' : 'method';
  const groupByType = groupArray(targetQuestionInfos, groupKey);
  const questionCountInfo = Object.entries(groupByType).reduce(
    (acc, [key, value]) => {
      const questionTypeInfo = value[0];
      const questionCount = value.length;
      acc[key] = questionCount;
      return acc;
    },
    {} as object
  );
  return questionCountInfo;
});

console.log('questionCountInfo.value', questionCountInfo.value);
</script>
