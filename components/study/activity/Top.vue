<template>
  <div class="study-activity__top">
    <!-- 아는 단어 개수 -->
    <span class="question-number text-success">
      <i class="pi pi-check"></i>
      <span class="known_count">{{ knownCount }}</span>
    </span>

    <span class="text-gray">
      | <span class="total_count">{{ questionCount }}</span>
    </span>

    <Button
      v-if="isCompleted && isMemorize"
      class="cancel-known"
      label="아는카드 취소"
      :text="true"
      @click="cancelKnown()"
    />
  </div>
</template>

<script setup>
const emits = defineEmits(['initQuestion']);

const {
  knownCount,
  questionCount,
  isCompleted,
  isMemorize,
  initQuestion,
  markAsKnown,
} = useStudy();

const cancelKnown = () => {
  markAsKnown(false);
  initQuestion();
};
</script>
