<template>
  <input
    v-if="!isMultipleLine"
    ref="inputRef"
    class="activity-input"
    :class="{
      correct: isCorrect,
      incorrect: isIncorrect,
      'immediate-incorrect': isImmediateIncorrect,
    }"
    :type="type"
    :placeholder="placeholder"
    :autofocus="isAutoFocus"
    :readonly="isReadonly"
    :value="value"
    @input="emits('input', $event)"
    @change="emits('change', $event)"
    @keydown="emits('keydown', $event)"
    @keyup.enter="emits('keyup.enter', $event)"
  />

  <textarea
    v-else
    ref="inputRef"
    class="activity-input multiline"
    :class="{
      correct: isCorrect,
      incorrect: isIncorrect,
      'immediate-incorrect': isImmediateIncorrect,
    }"
    :type="type"
    :placeholder="placeholder"
    :autofocus="isAutoFocus"
    :readonly="isReadonly"
    :value="value"
    @input="emits('input', $event)"
    @change="emits('change', $event)"
    @keydown="emits('keydown', $event)"
    @keyup.enter="emits('keyup.enter', $event)"
  />
</template>

<script setup lang="ts">
const emits = defineEmits(['input', 'change', 'keydown', 'keyup.enter']);

const props = defineProps<{
  type?: string;
  value?: string;
  placeholder?: string;
  isMultipleLine?: boolean;
  isAutoFocus?: boolean;
  isReadonly?: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  isImmediateIncorrect?: boolean;
}>();
const {
  type = 'text',
  value,
  placeholder,
  isMultipleLine,
  isAutoFocus,
  isReadonly,
  isCorrect,
  isIncorrect,
  isImmediateIncorrect,
} = toRefs(props);

const inputRef = ref<HTMLInputElement | null>(null);

// Focus / Blur 이벤트를 외부로 노출
const focus = () => inputRef.value?.focus();
const blur = () => inputRef.value?.blur();

defineExpose({ focus, blur });
</script>
