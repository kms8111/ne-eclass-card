<template>
  <div class="activity-button-wrap" :class="{ small: isSmall }">
    <Button
      class="activity-button"
      :label="label"
      :icon="icon"
      :severity="severity"
      :text="text"
      :outlined="outlined"
      :disabled="disabled"
      @click="emits('click')"
    />
    <span v-if="keyboardText" class="keyboard-text">{{ keyboardText }}</span>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits(['click']);

const { text, label, icon, severity, keyboardText, disabled } = defineProps<{
  label: string;
  icon?: string;
  severity: string;
  text?: boolean;
  outlined?: boolean;
  keyboardText?: string;
  disabled?: boolean;
  isSmall?: boolean;
}>();
</script>
