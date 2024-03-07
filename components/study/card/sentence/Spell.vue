<template>
  <div class="study-card__bottom-answer__spell" v-if="!isShowHint">
    <div class="study-card__bottom-answer__spell-input">
      <CommonActivityInput
        isAutoFocus
        ref="inputRef"
        placeholder="문장을 입력하세요."
        :isCorrect="isChecked && !isIncorrect"
        :isIncorrect="isIncorrect ?? false"
        :isImmediateIncorrect="isImmediateIncorrect"
        :isReadonly="isChecked"
        :value="inputValue"
        @input="handleChangeAnswer"
        @keydown="handleKeydown"
        @keyup.enter="handleSubmit"
      />
    </div>

    <div class="study-card__bottom-answer__spell-guide">
      <div v-if="!isChecked" class="study-card__bottom-answer__spell-hint">
        <span @click="showHint()">힌트보기</span>
      </div>

      <div
        v-if="isImmediateIncorrect"
        class="study-card__bottom-answer__spell-immediate-incorrect"
        @click="showHint()"
      >
        <span>입력내용이 정답과 일치하지 않습니다.</span>
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
import { isEmptyString } from '@/utils/common';

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

const { questionIndex, studyQuestionKey, updateQuestionData } = useQuestion();
const {
  isChecked,
  isCompleted,
  isIncorrect,
  isImmediateFeedback,
  isFirstLetterCheck,
  markAsKnown,
  updateAnswer,
} = useStudy();
const { playSound } = useAudio();

const inputRef = ref<HTMLInputElement | null>(null);
const inputValue = ref('');
const correctAnswer = computed(() => question[studyQuestionKey.value]);
const isImmediateIncorrect = computed(
  () =>
    isImmediateFeedback.value &&
    !isEmptyString(inputValue.value.trim()) &&
    !checkIsImmediateCorrect(inputValue.value)
);

const handleChangeAnswer = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const typedValue = (e as InputEvent).data;
  const typedAnswer = target.value;

  if (isFirstLetterCheck.value) {
    const typedChunks = typedAnswer
      .split(' ')
      .filter(chunk => !isEmptyString(chunk));
    const currentChunkIndex = typedChunks.length - 1;
    const isImmediateCorrect = checkIsImmediateCorrect(typedAnswer);
    const isTypedLetter = /\S/.test(typedValue || '');

    if (isTypedLetter && isImmediateCorrect) {
      target.value = `${getCorrectAnswerChunk(currentChunkIndex + 1)} `;
    } else {
      e.preventDefault();
      playSound('incorrect');
      target.value = isEmptyString(typedAnswer.trim())
        ? ''
        : `${getCorrectAnswerChunk(currentChunkIndex)} `;

      return;
    }
  }

  inputValue.value = target.value;
  updateAnswer(inputValue.value);
};

const handleKeydown = (e: Event) => {
  const typedValue = (e as KeyboardEvent).key;

  if (isFirstLetterCheck.value) {
    const isTypedLetter =
      !isEmptyString(typedValue.trim()) && typedValue.length === 1;
    if (!isTypedLetter) {
      e.preventDefault();
      playSound('incorrect');
    }
  }
};

const getCorrectAnswerChunk = (index: number) => {
  if (index < 0) return '';

  const correctAnswerChunks = correctAnswer.value.split(' ');
  const correctChunkAnswer = correctAnswerChunks.slice(0, index).join(' ');
  return correctChunkAnswer;
};

const showHint = () => emits('showHint');

const checkAnswer = () => {
  const typedAnswer = inputValue.value.trim();
  const isAnswerTyped = typedAnswer.length > 0;
  if (isChecked.value || !isAnswerTyped) return;

  const isCorrect =
    typedAnswer.toLowerCase() === correctAnswer.value.toLowerCase();

  updateQuestionData({
    correctAnswers: [correctAnswer.value],
    isCompleted: isCorrect,
  });

  emits('checkWord');

  if (isCorrect) markAsKnown(isCorrect);
};

const checkIsImmediateCorrect = (studentAnswer: string) => {
  const targetAnswer = studentAnswer.trim();
  const isImmediateCorrect = correctAnswer.value
    .trim()
    .toLowerCase()
    .startsWith(targetAnswer.toLowerCase());
  return isImmediateCorrect;
};

const handleSubmit = (e: Event) => {
  if (currentIndex !== questionIndex.value) return;

  const target = e.target as HTMLInputElement;
  target.blur();

  handleChangeAnswer(e);
  checkAnswer();
};

// Focus 처리
const handleFocus = () => {
  const isCurrentQuestion = questionIndex.value === currentIndex;
  if (!isCurrentQuestion || isChecked.value) return;

  setTimeout(() => {
    inputRef.value?.focus();
  }, 500);
};

watch(questionIndex, handleFocus);

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
