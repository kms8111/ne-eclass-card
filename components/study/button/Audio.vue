<template>
  <div class="audio-button">
    <Button
      :disabled="isDisabled"
      :icon="audioIcon"
      :text="true"
      @click="play()"
    />
  </div>
</template>

<script lang="ts" setup>
const { audio, isDisabled = false } = defineProps<{
  audio: string;
  isDisabled?: boolean;
}>();
const { playAudio, isPlaying } = useAudio();

const audioIcon = computed(() =>
  isPlaying.value ? 'pi pi-pause active' : 'pi pi-volume-down'
);

const play = () => {
  try {
    playAudio(audio);
  } catch (error) {
    console.log('play() - error', error);
  }
};
</script>
