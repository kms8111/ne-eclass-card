<template>
  <div class="bookmark-button">
    <Button :icon="bookmarkIcon" :text="true" @click="toggleBookmark()" />
  </div>
</template>

<script setup lang="ts">
const { questionId } = defineProps<{ questionId: number }>();

const { getQuestionData } = useQuestion();
const { toggleBookmark } = useStudy();

const questionData = computed(() => getQuestionData(questionId));
const bookmarkIcon = computed(() =>
  isBookmarked.value ? 'pi pi-star-fill bookmarked' : 'pi pi-star'
);
const isBookmarked = computed(() => questionData.value?.isBookmarked || false);
</script>
