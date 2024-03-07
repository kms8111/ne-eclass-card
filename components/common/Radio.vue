<template>
  <RadioButton :disabled="disabled" v-model="isChecked" />
</template>

<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean;
  checked?: boolean;
}>();
const { disabled, checked } = toRefs(props);

const isChecked = ref(checked.value);

watch(checked, () => {
  isChecked.value = checked.value;
});
</script>
