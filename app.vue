<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <!-- Modals -->
    <ModalLoading />
    <ModalToast />
    <ModalAlert />
    <ModalConfirm />
  </div>
</template>

<script setup lang="ts">
import 'animate.css';
</script>
