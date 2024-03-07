<template>
  <CommonFlashText
    :text="START_TEXT"
    @done="startStudy()"
    v-if="isShowFlashText"
  />

  <div class="study-activity" v-else>
    <StudyActivityTop />

    <div class="study-activity__content">
      <CommonCarousel
        ref="carousel"
        class="study-activity__content-carousel"
        :space="30"
        :pageIndex="questionIndex"
        :isNavigation="isNavigation"
        @update:pageIndex="handleMoveQuestion($event)"
      >
        <StudyCard
          v-for="(question, questionIndex) in displayQuestions"
          :question="question"
          :questionIndex="questionIndex"
          :isShowMeaning="!!showMeanings[questionIndex]"
          :isShowHint="!!showHints[questionIndex]"
          @checkWord="checkWord"
          @showHint="showHint"
        />
      </CommonCarousel>
    </div>

    <StudyActivityBottom @checkAnswer="checkAnswer" @checkWord="checkWord" />
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const START_TEXT = '학습을 시작합니다.';

const studyStore = useStudyStore();

const { bookType, questions, questionIndex, isMemorize } =
  storeToRefs(studyStore);
const { studyQuestionKey, updateQuestionData, getStudentAnswer, getIsCorrect } =
  useQuestion();
const {
  isShowFlashText,
  isChecked,
  question,
  showMeanings,
  showHints,
  isCompleted,
  isShowHint,
  isNavigation,
  isQuestionMoving,
  initStudy,
  initQuestion,
  startStudy,
  toggleBookmark,
  markAsKnown,
  handleNext,
  handleMoveQuestion,
} = useStudy();
const { playAudio } = useAudio();
const displayQuestions = ref<Question[]>(questions.value);

// TODO: 필요 시 Word/Sentence의 Spell.vue 의 checkAnswer() 과 통합
const checkAnswer = () => {
  const isCorrect = getIsCorrect(question.value.cardId);
  const studentAnswer = getStudentAnswer(question.value.cardId);

  if (bookType.value === 'sentence') {
    const isAnswerTyped = (studentAnswer as string).length > 0;
    if (isChecked.value || !isAnswerTyped) return;

    const correctAnswer = question.value[studyQuestionKey.value];

    updateQuestionData({ correctAnswers: [correctAnswer] });
  } else {
    const isAnswerTyped = (studentAnswer as string).length > 0;
    if (isChecked.value || !isAnswerTyped) return;

    const correctAnswers = question.value.correctAnswers;

    updateQuestionData({ correctAnswers });
  }

  markAsKnown(isCorrect);
  checkWord();
};

const checkWord = async () => {
  if (
    isShowFlashText.value ||
    isQuestionMoving.value ||
    isSwiping.value ||
    isShowHint.value
  )
    return;

  showMeanings.value[questionIndex.value] = true;
  isChecked.value = true;

  try {
    await playAudio(question.value.audio);
  } catch (error) {
    console.log('checkWord() - error', error);
  }

  // memorize 학습이 아닐 때는 isCompleted = true 라면 바로 다음 문항으로 이동
  if (!isMemorize.value && isCompleted.value) setTimeout(handleNext, 250);
};

const showHint = async () => {
  if (isShowFlashText.value || isQuestionMoving.value || isSwiping.value)
    return;

  const miniumDuration = 3000;
  const currentTimestamp = new Date().getTime();

  showHints.value[questionIndex.value] = true;

  try {
    await playAudio(question.value.audio);
  } catch (error) {
    console.log('showHint() - error', error);
  }

  const duration = new Date().getTime() - currentTimestamp;
  const delay = duration < miniumDuration ? miniumDuration - duration : 0;
  setTimeout(() => {
    showHints.value[questionIndex.value] = false;
  }, delay);
};

// Carousel Swipe 처리
const carousel = ref<HTMLElement | null>(null);
const handleSwipeCarousel = (options: SlideCallbackOptions) => {
  // 단어 학습(bookType === 'word') 이면서 암기 학습(memorize)인 경우
  if (isNavigation.value) {
    const { direction } = options;
    if (direction === 'left') handleMoveQuestion(questionIndex.value + 1);
    else if (direction === 'right') handleMoveQuestion(questionIndex.value - 1);
  }

  // 그 외 학습인 경우는 확인 완료인 경우에만 다음 문항으로 이동
  else if (isChecked.value) {
    const { direction } = options;
    if (direction === 'left') handleMoveQuestion(questionIndex.value + 1);
  }
};

const { isSwiping } = useSlide(carousel, {
  onSwipeEnd: handleSwipeCarousel,
});

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  // 공통
  if (keyName === 'escape') {
    toggleBookmark();
  }

  // Navigation이 가능한 학습일 경우
  if (isNavigation.value) {
    if (keyName === 'arrowup') {
      if (!isCompleted.value) initQuestion();
    } else if (keyName === 'arrowdown') {
      if (isNavigation.value) checkWord();
    } else if (keyName === 'arrowleft') {
      if (isNavigation.value) handleMoveQuestion(questionIndex.value - 1);
    } else if (keyName === 'arrowright') {
      if (isNavigation.value) handleMoveQuestion(questionIndex.value + 1);
    }
  }

  // 그 외 학습일 경우
  else {
    if (isChecked.value) {
      if (keyName === 'space') {
        return handleNext();
      } else if (keyName === 'arrowright') {
        return handleNext();
      }
    }
  }
};

useKeyStroke(true, handleKeyStroke);

// 학습 시작 초기화
initStudy();

watch(questions, () => {
  displayQuestions.value = questions.value;
});
</script>
