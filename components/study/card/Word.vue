<template>
  <div class="study-card-word">
    <div class="study-card__top">
      <StudyCardElementControl v-if="!isAudioStudy" :question="question" />

      <StudyCardWordQuestion
        :question="question"
        :isCompleted="isCompleted"
        :isIncorrect="isIncorrect ?? false"
      />
    </div>

    <div ref="cardCoverContainer" class="study-card__bottom">
      <div
        ref="cardCover"
        class="study-card__bottom-cover"
        :class="{ showing: isShowMeaning || studyType === 'spell' }"
      />

      <div class="study-card__bottom-answer">
        <StudyCardWordText v-if="isMemorize" :text="question[studyAnswerKey]" />
        <StudyCardWordMultiple
          v-else-if="studyType === 'recall'"
          :question="question"
          :questionIndex="questionIndex"
          @checkWord="emits('checkWord')"
        />
        <StudyCardWordSpell
          v-else-if="studyType === 'spell'"
          :question="question"
          :questionIndex="questionIndex"
          :isShowHint="isShowHint"
          @checkWord="emits('checkWord')"
          @showHint="emits('showHint')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Question } from '~/types/study';

const emits = defineEmits(['checkWord', 'showHint']);

const { question, questionIndex, isShowMeaning, isShowHint } = defineProps<{
  question: Question;
  questionIndex: number;
  isShowMeaning: boolean;
  isShowHint: boolean;
}>();
const studyStore = useStudyStore();

const {
  studyType,
  questionIndex: currenQuestionIndex,
  isMemorize,
} = storeToRefs(studyStore);
const { studyAnswerKey, getQuestionData } = useQuestion();
const { isNavigation, isIncorrect, isAudioStudy } = useStudy();

const questionData = computed(() => getQuestionData(question.cardId));
const isCompleted = computed(() => questionData.value?.isCompleted || false);

// Card Cover Swipe 처리
const cardCover = ref<HTMLElement | null>(null);
const isSwipeComplete = ref(false);

const initSwipeCover = () => {
  if (!cardCover.value) return;
  cardCover.value.style.removeProperty('height');
  cardCover.value.style.removeProperty('transition');
};

const handleSwipeCover = (options: SlideCallbackOptions) => {
  if (!cardCover.value || isSwipeComplete.value || !isMemorize.value) return;

  const { moveY } = options;

  // Swipe 방향이 아래로일 때만 처리
  if (moveY > 0) return;
  const moveYAbs = Math.abs(moveY);

  cardCover.value.style.transition = 'none';
  cardCover.value.style.height = `calc(100% - ${moveYAbs}px)`;
};

const handleSwipeCoverEnd = (options: SlideCallbackOptions) => {
  if (!isNavigation.value || !cardCover.value || isSwipeComplete.value) return;

  // 70% 이상 Swipe 했을 때, Swipe 완료 처리
  const { moveY } = options;
  const moveYAbs = Math.abs(moveY);
  const parentHeight = cardCover.value.parentElement?.clientHeight || 0;
  const isSwipeEnough = moveYAbs > parentHeight * 0.6;

  if (isSwipeEnough) {
    isSwipeComplete.value = true;
    cardCover.value.style.height = '0px';
    cardCover.value.style.removeProperty('transition');
    return setTimeout(() => emits('checkWord'), 300);
  } else {
    initSwipeCover();
  }
};

useSlide(cardCover, {
  mouseThreshold: 0,
  touchThreshold: 0,
  onSwipe: handleSwipeCover,
  onSwipeEnd: handleSwipeCoverEnd,
});

// 문항 변경 시, Card Cover 초기화
watch(currenQuestionIndex, () => {
  isSwipeComplete.value = false;
  initSwipeCover();
});
</script>
