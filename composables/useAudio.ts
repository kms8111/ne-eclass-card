import type { SoundType } from '~/types/common';

export const useAudio = () => {
  const commonStore = useCommonStore();
  const { contentHost, audioPlayer } = commonStore;
  const { isPlaying } = storeToRefs(commonStore);
  const { settingInfo } = useSetting();

  const play = (
    audioUrl: string,
    player: HTMLAudioElement = audioPlayer
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      player.src = audioUrl;
      player.playbackRate =
        settingInfo.value?.audioSpeed ?? player.playbackRate;

      player.addEventListener('error', () => {
        console.error(
          `playAudio() - error ${audioUrl} 오디오 재생에 실패하였습니다.`
        );
        reject('오디오 재생에 실패하였습니다.');
      });
      player.addEventListener('ended', () => {
        isPlaying.value = false;
        resolve();
      });
      player.play();
    });
  };

  const playAudio = (audioUrl: string): Promise<void> => {
    if (isPlaying.value) audioPlayer.pause();
    isPlaying.value = true;
    const audioFullUrl = `${contentHost}${audioUrl}`;

    return play(audioFullUrl, audioPlayer);
  };

  const playSound = (type: SoundType): Promise<void> => {
    const soundPlayer = new Audio();
    const soundUrl = `/sounds/${type}.mp3`;
    console.log('soundUrl', soundUrl);

    return play(soundUrl, soundPlayer);
  };

  return {
    isPlaying,
    playAudio,
    playSound,
  };
};
