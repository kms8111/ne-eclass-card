<template>
  <div class="test-card__multiple">
    <div class="test-card__multiple-list">
      <div
        class="test-card__multiple-item"
        :class="{
          answered: isAnswered,
          correct: selectedIndex === answerNumber - 1 && isCorrect,
          incorrect: selectedIndex === answerNumber - 1 && isIncorrect,
        }"
        v-for="answerNumber in 6"
        :key="answerNumber"
        @click="selectAnswer(answerNumber - 1)"
      >
        <CommonAnswerMark
          v-if="isAnswered"
          isSmall
          isBorder
          :isCorrect="selectedIndex === answerNumber - 1 && isCorrect"
          :isIncorrect="selectedIndex === answerNumber - 1 && isIncorrect"
        />

        <div class="test-card__multiple-item__number">
          {{ answerNumber }}
        </div>

        <div class="test-card__multiple-item__text">
          {{ answers[answerNumber - 1] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  answers,
  selectedIndex,
  isAnswered,
  isCorrect,
  isIncorrect,
  selectAnswer,
} = useTest();
</script>
