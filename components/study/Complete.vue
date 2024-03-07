<template>
  <div class="study-complete">
    <div class="study-complete__top">
      <div class="study-complete__content">
        <div class="study-complete__title">학습 완료!</div>

        <div class="study-complete__message">
          <p class="main-message"><strong>Good</strong>Job!!</p>
          <p class="sub-message">학습이 완료 되었습니다.</p>
        </div>
      </div>

      <div class="study-complete__image">
        <img src="~/assets/images/complete-study.gif" alt="study-complete" />
      </div>
    </div>

    <div class="study-complete__bottom">
      <CommonActivityButton
        label="학습 종료"
        severity="help"
        keyboardText="Space"
        @click="endStudy(true)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { endStudy } = useStudy();

const handleKeyStroke = (keyName: string) => {
  if (keyName === 'space') {
    endStudy(true);
  }
};

useKeyStroke(true, handleKeyStroke);
</script>
