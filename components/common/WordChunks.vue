<template>
  <div class="word-chunks">
    <div class="word-chunks-list">
      <template v-for="(chunk, index) in chunks" :key="index">
        <span
          v-if="!selectedIndexes?.includes(index)"
          class="word-chunks-item"
          :class="{
            incorrect: incorrectAnimations.includes(index),
            shake: incorrectAnimations.includes(index),
          }"
          @click="emits('onSelect', chunk, index)"
        >
          {{ chunk }}
        </span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['onSelect']);

const props = defineProps<{
  chunks: string[];
  selectedIndexes?: number[];
  incorrectAnimations: number[];
}>();
const {
  chunks,
  selectedIndexes = [] as number[],
  incorrectAnimations,
} = toRefs(props);
</script>
