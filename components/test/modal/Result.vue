<template>
  <Dialog
    modal
    class="test-result"
    :style="{ width: '50rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    v-model:visible="isShow"
    @after-hide="$emit('close')"
  >
    <template #header>
      <div class="test-result-header">
        <div
          class="test-result-header-title"
          :class="{
            'text-success': score >= goalScore,
            'text-danger': score < goalScore,
          }"
        >
          {{ testTryCount }}차 {{ score }}점
        </div>

        <div class="test-result-header-subtitle">
          / {{ goalScore }}점(목표점수)
        </div>
      </div>
    </template>

    <div class="test-result-body">
      <div class="test-result-body-top">
        <Checkbox :binary="true" v-model="isOnlyIncorrect" />
        오답만 보기
      </div>

      <div class="test-result-question-list">
        <div
          class="test-result-question-item"
          v-for="(questionData, index) in testQuestionDatas"
          :key="index"
        >
          <div class="test-question-header">
            <div
              class="test-question-mark"
              :class="{
                'text-success': questionData.isCorrect,
                'text-danger': !questionData.isCorrect,
              }"
            >
              {{ questionData.isCorrect ? 'O' : 'X' }}
            </div>

            <div class="test-question-number">
              {{ index + 1 }}
            </div>

            <StudyButtonAudio
              v-if="questionData.method === 'audio'"
              :audio="questionData.audio"
            />
            <div v-else class="test-question-text">
              {{
                questionData[
                  getAnswerKey(questionData.type, questionData.method)
                ]
              }}
            </div>
          </div>

          <!-- 객관식인 경우 -->
          <div
            v-if="questionData.type === 'multiple'"
            class="test-question-option-list"
          >
            <div
              class="test-question-option-item"
              v-for="(option, optionIndex) in questionData.answers"
              :key="optionIndex"
            >
              <CommonTextBadge
                v-if="
                  optionIndex === questionData.correctIndex &&
                  optionIndex !== questionData.selectedIndex
                "
                type="correct"
                label="정답"
              />

              <CommonRadio
                :disabled="optionIndex !== questionData.selectedIndex"
                :value="optionIndex !== questionData.selectedIndex"
              />
              <span
                :class="{
                  'text-success': optionIndex === questionData.correctIndex,
                  'text-danger':
                    optionIndex === questionData.selectedIndex &&
                    optionIndex !== questionData.correctIndex,
                }"
              >
                {{ option }}
              </span>
            </div>
          </div>

          <!-- 그 외 [주관식, 어순배열 등] -->
          <div v-else>
            <div class="test-question-typing">
              <div
                v-if="questionData.method === 'chunk'"
                class="test-question-typing-input"
              >
                {{ questionData.chunkAnswers?.join(' ') }}
              </div>

              <div v-else class="test-question-typing-input">
                {{ questionData.spellAnswer }}
              </div>

              <div class="test-question-typing-correct">
                <CommonTextBadge type="correct" label="정답" />
                {{ questionData.correctAnswers?.join(' ') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import type { TestQuestionData } from '@/types/test';

defineEmits(['close']);

const {
  goalScore = 0,
  testTryCount,
  questionDatas,
} = defineProps<{
  goalScore: number;
  testTryCount: number;
  questionDatas: TestQuestionData[];
}>();
const isShow = defineModel<boolean>('isShow');

const { getAnswerKey } = useQuestion();
const isOnlyIncorrect = ref(false);

const testQuestionDatas = computed<TestQuestionData[]>(() => {
  return isOnlyIncorrect.value
    ? questionDatas.filter(question => !question.isCorrect)
    : questionDatas;
});
const score = computed(() => {
  const questionCount = questionDatas.length;
  const correctCount = questionDatas.filter(
    question => question.isCorrect
  ).length;
  const score = Math.floor((correctCount / questionCount) * 100);

  return isNaN(score) ? 0 : score;
});
</script>
