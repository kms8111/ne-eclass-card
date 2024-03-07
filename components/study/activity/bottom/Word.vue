<template>
  <div v-if="isMemorize" class="study-activity__bottom">
    <CommonActivityButton
      v-if="!isChecked"
      label="의미 보기"
      keyboardText="Space"
      severity="help"
      @click="checkWord()"
    />

    <template v-else>
      <CommonActivityButton
        label="이제 알아요"
        keyboardText="Enter"
        icon="pi pi-check"
        severity="success"
        @click="completeWord(true)"
      />

      <CommonActivityButton
        label="나중에 한번 더"
        keyboardText="Space"
        severity="secondary"
        @click="completeWord()"
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
      keyboardText="Space"
      severity="secondary"
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
      <CommonActivityButton
        v-if="!isChecked"
        label="확인"
        keyboardText="Enter"
        severity="help"
        @click="checkAnswer()"
      />

      <CommonActivityButton
        v-else-if="isIncorrect"
        label="나중에 한번 더"
        keyboardText="Space"
        severity="secondary"
        @click="completeWord()"
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
  isIncorrect,
  isNavigation,
  isChecked,
  isCompleted,
  completeWord,
} = useStudy();

const checkAnswer = () => emits('checkAnswer');
const checkWord = () => emits('checkWord');

// Keyboard 입력 처리
const handleKeyStroke = (keyName: string) => {
  // Navigation이 가능한 학습이거나 채점이 완료된 경우
  if (isNavigation.value || isChecked.value) {
    if (keyName === 'space') {
      if (!isChecked.value) checkWord();
      else completeWord();
    } else if (keyName === 'enter') {
      if (isChecked.value && (isNavigation.value || isCompleted.value))
        completeWord(true);
    }
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
