<template>
  <div class="study-card__bottom-answer__spell" v-if="!isShowHint">
    <div class="study-card__bottom-answer__spell-input">
      <CommonActivityInput
        isAutoFocus
        ref="inputRef"
        placeholder="정답은 줄바꿈 없이 1줄로 입력하세요."
        :isCorrect="isChecked && !isIncorrect"
        :isIncorrect="isIncorrect ?? false"
        :isReadonly="isChecked"
        :value="inputValue"
        @change="handleChangeAnswer"
        @keyup.enter="checkAnswer"
      />
    </div>

    <div class="study-card__bottom-answer__spell-guide">
      <div v-if="!isChecked" class="study-card__bottom-answer__spell-hint">
        <span @click="showHint()">힌트보기</span>
      </div>

      <div
        v-else-if="isIncorrect"
        class="study-card__bottom-answer__spell-answer"
      >
        <CommonTextBadge type="correct" label="정답" />

        <span class="study-card__bottom-answer__spell-answer-text">
          {{ correctAnswer }}
        </span>
      </div>
    </div>
  </div>

  <div v-else class="study-card__bottom-answer__hint">
    {{ correctAnswer }}
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord', 'showHint']);

const {
  question,
  questionIndex: currentIndex,
  isShowHint,
} = defineProps<{
  question: Question;
  questionIndex: number;
  isShowHint: Boolean;
}>();

const { questionIndex, updateQuestionData } = useQuestion();
const { isChecked, isCompleted, isIncorrect, markAsKnown, updateAnswer } =
  useStudy();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');
const correctAnswer = computed(() => question.correctAnswers.join(', '));

const handleChangeAnswer = (e: Event) => {
  const target = e.target as HTMLInputElement;
  inputValue.value = target.value;
  updateAnswer(inputValue.value);
};

const showHint = () => emits('showHint');

const checkAnswer = () => {
  const typedAnswer = inputValue.value.trim();
  const isAnswerTyped = typedAnswer.length > 0;
  if (isChecked.value || !isAnswerTyped) return;

  const correctAnswers = question.correctAnswers;
  const isCorrect = correctAnswers.includes(typedAnswer.toLowerCase());

  updateQuestionData({
    correctAnswers,
    spellAnswer: typedAnswer,
    isCompleted: isCorrect,
  });

  emits('checkWord');

  if (isCorrect) markAsKnown(isCorrect);
};

// Focus 처리
const handleFocus = () => {
  const isCurrentQuestion = questionIndex.value === currentIndex;
  if (!isCurrentQuestion || isChecked.value) return;

  setTimeout(() => inputRef.value?.focus(), 500);
};

watch(questionIndex, () => {
  handleFocus();
});

watch(isChecked, () => {
  if (isChecked.value) {
    if (!isCompleted.value) inputRef.value?.blur();
  } else {
    if (!isCompleted.value) {
      inputValue.value = '';
      handleFocus();
    }
  }
});
</script>
