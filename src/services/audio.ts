import { usePlayerStore } from '../state/playerStore';
import { useLyricsStore } from '../state/lyricsStore';
import {convertFileSrc } from '@tauri-apps/api/core';

const audioElement = new Audio();
audioElement.addEventListener('error', () => {
  console.error("🔴 Audio Player Error! Code:", audioElement.error?.code, "Message:", audioElement.error?.message);
});

audioElement.volume = usePlayerStore.getState().volume;

audioElement.addEventListener('timeupdate', () => {
    const currentTime = audioElement.currentTime;

    usePlayerStore.getState().setCurrentTime(currentTime);

    const lyricsLines = useLyricsStore.getState().lines;
    if (lyricsLines.length > 0) {
        let newActiveIndex = -1;

        for(let i = lyricsLines.length -1; i>=0; i--){
            const offsetMs = useLyricsStore.getState().offsetMs;
            const adjustedLyricTime = lyricsLines[i].time + (offsetMs /1000);
            if (currentTime >= adjustedLyricTime){
                newActiveIndex = i;
                break;
            }
        }
        if(newActiveIndex !== useLyricsStore.getState().activeLineIndex){
            useLyricsStore.getState().setActiveLine(newActiveIndex);
        }
    }
});


audioElement.addEventListener('loadedmetadata', () => {
  usePlayerStore.getState().setDuration(audioElement.duration);
});


audioElement.addEventListener('durationchange', () => {
  usePlayerStore.getState().setDuration(audioElement.duration);
});


audioElement.addEventListener('canplay', () => {
  usePlayerStore.getState().setDuration(audioElement.duration);
});

audioElement.addEventListener('ended', () => {
  console.log("🎵 Song ended");
  
  const store = usePlayerStore.getState();
  
  if (store.currentQueueIndex < store.queue.length - 1) {
    store.playNext();
  } else {
    store.setIsPlaying(false);
    store.setCurrentTime(0);
  }
});

export const audioService = {
  loadSong: (path: string) => {
    const assetUrl = convertFileSrc(path);
    audioElement.src = assetUrl;
    audioElement.load();
    

    usePlayerStore.getState().setCurrentSong(path);
  },

  play: () => {
    audioElement.play()
      .then(() => usePlayerStore.getState().setIsPlaying(true))
      .catch((err) => console.error("🔴 Playback Error:", err));
  },

  pause: () => {
    audioElement.pause();
    usePlayerStore.getState().setIsPlaying(false);
  },

  seek: (time: number) => {
    audioElement.currentTime = time;
    usePlayerStore.getState().setCurrentTime(time);
  },

  setVolume: (volume: number) => {
    audioElement.volume = volume;
  }
};