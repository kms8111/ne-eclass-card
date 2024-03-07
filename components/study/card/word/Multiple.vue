<template>
  <div
    class="study-card__bottom-answer__multiple"
    :class="{ answered: isAnswered }"
  >
    <div
      v-for="(answer, index) in question.answers"
      :key="index"
      class="study-card__bottom-answer__multiple-item"
      :class="{
        selected: selectedIndex === index,
        correct: isAnswered && question.correctIndex === index,
        incorrect: selectedIndex === index && question.correctIndex !== index,
      }"
      @click="selectAnswer(index)"
    >
      <div class="study-card__bottom-answer__multiple-item-content">
        <span class="study-card__bottom-answer__multiple-item-number">
          {{ index + 1 }}.
        </span>
        <span class="study-card__bottom-answer__multiple-item-answer">
          {{ answer }}
        </span>
      </div>

      <CommonTextBadge
        v-if="isAnswered && isIncorrect && question.correctIndex === index"
        type="correct"
        label="정답"
      />
    </div>
  </div>
</template>
´

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord']);
const { question, questionIndex: currentIndex } = defineProps<{
  question: Question;
  questionIndex: number;
}>();

const { questionIndex, getQuestionData, updateQuestionData, getIsAnswered } =
  useQuestion();
const { markAsKnown } = useStudy();

const questionData = computed(() => getQuestionData(question.cardId));
const selectedIndex = computed(() =>
  questionData.value ? questionData.value.selectedIndex : -1
);
const isAnswered = computed(() => getIsAnswered(question.cardId));
const isCompleted = computed(() => questionData.value?.isCompleted || false);
const isIncorrect = computed(() => isAnswered.value && !isCompleted.value);

const selectAnswer = (index: number) => {
  if (isAnswered.value) return;

  const isCorrect = question.correctIndex === index;
  updateQuestionData({
    correctIndex: question.correctIndex,
    selectedIndex: index,
  });
  markAsKnown(isCorrect);

  emits('checkWord');
};

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  if (currentIndex !== questionIndex.value) return;

  const numberKey = keyName.replace(/(digit)|(numpad)/g, '');
  const isNumberKey = isNumber(numberKey);

  if (isNumberKey) {
    const answerIndex = parseInt(numberKey) - 1;
    const isAnswerExist = question.answers[answerIndex];
    if (isAnswerExist) selectAnswer(answerIndex);
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
