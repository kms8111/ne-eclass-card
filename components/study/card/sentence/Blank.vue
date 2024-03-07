<template>
  <div
    v-if="!isAnswered"
    class="study-card__bottom-answer__multiple"
    :class="{ answered: isAnswered }"
  >
    <div
      v-for="(chunk, index) in question.blankOptions"
      :key="index"
      class="study-card__bottom-answer__multiple-item"
      :class="{
        selected: selectedIndexes?.includes(index),
      }"
      @click="selectAnswer(index)"
    >
      <div class="study-card__bottom-answer__multiple-item-content">
        <span class="study-card__bottom-answer__multiple-item-number">
          {{ index + 1 }}.
        </span>
        <span class="study-card__bottom-answer__multiple-item-answer">
          {{ chunk }}
        </span>
      </div>

      <CommonTextBadge
        v-if="isAnswered && isIncorrect && question.correctIndex === index"
        type="correct"
        label="정답"
      />
    </div>
  </div>

  <StudyCardSentenceExplanation
    v-else
    :question="question"
    :isCorrectAnswer="isIncorrect"
  />
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord']);
const { question, questionIndex: currentIndex } = defineProps<{
  question: Question;
  questionIndex: number;
}>();

const studyStore = useStudyStore();
const { questionIndex } = storeToRefs(studyStore);
const { getQuestionData, updateQuestionData, getIsAnswered } = useQuestion();
const { selectedAnswers, selectedIndexes, correctAnswers, markAsKnown } =
  useStudy();

const questionData = computed(() => getQuestionData(question.cardId));
const isAnswered = computed(() => getIsAnswered(question.cardId));
const isCompleted = computed(() => questionData.value?.isCompleted || false);
const isIncorrect = computed(() => isAnswered.value && !isCompleted.value);

const selectAnswer = (index: number) => {
  if (isAnswered.value) return;

  const oldSelectedAnswers = selectedAnswers.value ?? [];
  const chunk = question.blankOptions[index];
  const isSelected = selectedIndexes.value.includes(index);

  if (isSelected) {
    selectedIndexes.value = selectedIndexes.value.filter(
      selectedIndex => selectedIndex !== index
    );
    updateQuestionData({
      selectedAnswers: oldSelectedAnswers.filter(answer => answer !== chunk),
    });

    return;
  }

  selectedIndexes.value.push(index);
  const newSelectedAnswers = [...oldSelectedAnswers, chunk];
  const isFinished = newSelectedAnswers.length === correctAnswers.value.length;
  const isCorrect = oldSelectedAnswers.every(
    (answer, index) => answer === correctAnswers.value[index]
  );

  if (isFinished) {
    updateQuestionData({
      correctAnswers: correctAnswers.value,
      selectedAnswers: newSelectedAnswers,
    });

    markAsKnown(isCorrect);
    emits('checkWord');
  } else {
    updateQuestionData({
      selectedAnswers: newSelectedAnswers,
    });
  }
};

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  if (currentIndex !== questionIndex.value) return;

  const numberKey = keyName.replace(/(digit)|(numpad)/g, '');
  const isNumberKey = isNumber(numberKey);

  if (isNumberKey) {
    const answerIndex = parseInt(numberKey) - 1;
    const isAnswerExist = correctAnswers.value.length - 1 >= answerIndex;
    if (isAnswerExist) selectAnswer(answerIndex);
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
