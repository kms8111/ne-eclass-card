<template>
  <Dialog
    modal
    class="error-modal"
    :header="title"
    :closable="false"
    :style="{ width: '25rem' }"
    v-model:visible="isShow"
  >
    <div v-if="message" class="error-modal-message">
      {{ message }}
    </div>

    <template #footer>
      <div class="error-modal-footer" :style="{}">
        <Button
          :label="confirmLabel"
          :severity="confirmColor"
          :style="{ flex: 1 }"
          @click="handleClick"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
const modalStore = useModalStore();
const { alertInfo } = storeToRefs(modalStore);
const { hideAlert } = useModal();

const title = computed(() => alertInfo.value.title);
const message = computed(() => alertInfo.value.message);
const confirmLabel = computed(() => alertInfo.value.confirmLabel);
const confirmColor = computed(() => alertInfo.value.confirmColor);
const isShow = computed(() => alertInfo.value.isShow);

const handleClick = () => {
  const { onClick } = alertInfo.value;
  if (typeof onClick === 'function') onClick();

  hideAlert();
};

useKeyStroke(true, (keyName: string) => {
  if (keyName === 'enter' || keyName === 'escape') {
    handleClick();
  }
});
</script>
