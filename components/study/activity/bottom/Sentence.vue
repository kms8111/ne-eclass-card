<template>
  <div v-if="isMemorize" class="study-activity__bottom">
    <CommonActivityButton
      v-if="isCardPreview"
      label="영작 연습하기"
      keyboardText="Space"
      severity="success"
      @click="moveCardPage('question')"
    />

    <template v-else>
      <CommonActivityButton
        label="한번 더 할까요?"
        icon="pi pi-check"
        keyboardText="Enter"
        severity="secondary"
        :disabled="!isChecked"
        @click="retryQuestion()"
      />

      <CommonActivityButton
        :label="isChecked ? '다음 카드' : '나중에 다시'"
        severity="help"
        keyboardText="Space"
        @click="completeWord(isChecked)"
      />
    </template>
  </div>

  <div v-else-if="isRecall" class="study-activity__bottom">
    <span v-if="!isChecked && !isMobileDevice" class="keyboard-text">
      키보드로 숫자를 선택할 수 있습니다.
    </span>

    <CommonActivityButton
      v-else-if="isIncorrect"
      label="나중에 한번 더"
      severity="secondary"
      keyboardText="Space"
      @click="completeWord()"
    />
  </div>

  <div v-else-if="isSpell" class="study-activity__bottom">
    <span
      v-if="showHints[questionIndex]"
      class="study-activity__bottom-hint-message"
    >
      잠시 정답을 보고 기억하세요...
    </span>

    <template v-else>
      <template v-if="isIncorrect || isChunkStudy">
        <CommonActivityButton
          label="지금 재시도"
          keyboardText="Enter"
          :severity="isChecked ? 'success' : 'secondary'"
          :disabled="!isChecked"
          @click="retryQuestion()"
        />

        <CommonActivityButton
          label="나중에 다시"
          keyboardText="Space"
          severity="help"
          @click="completeWord()"
        />
      </template>

      <CommonActivityButton
        v-else-if="!isChecked"
        label="확인"
        keyboardText="Enter"
        severity="help"
        @click="checkAnswer()"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['checkAnswer', 'checkWord']);

const commonStore = useCommonStore();
const studyStore = useStudyStore();

const { isMobileDevice } = storeToRefs(commonStore);
const { questionIndex, isMemorize, isRecall, isSpell } =
  storeToRefs(studyStore);
const {
  showHints,
  isChecked,
  isCompleted,
  isIncorrect,
  isCardPreview,
  isChunkStudy,
  retryQuestion,
  moveCardPage,
  completeWord,
  handleNext,
} = useStudy();

const checkAnswer = () => emits('checkAnswer');
const checkWord = () => emits('checkWord');

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  if (keyName === 'space') {
    if (isMemorize.value) {
      if (isCardPreview.value) moveCardPage('question');
      else completeWord(isChecked.value);
    } else if (isRecall.value) {
      if (!isChecked.value) checkWord();
      else completeWord();
    } else if (isSpell.value) {
      if (isChecked.value) handleNext();
    }
  } else if (keyName === 'enter') {
    if (isMemorize.value) {
      if (isChecked.value) retryQuestion();
    } else if (isRecall.value) {
      if (isChecked.value) completeWord(true);
    } else if (isSpell.value) {
      if (isChecked.value) {
        if (isCompleted.value) completeWord(true);
        else retryQuestion();
      }
    }
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
