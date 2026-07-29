import { usePlayerStore } from '../state/playerStore';
import { useLyricsStore } from '../state/lyricsStore';
import {convertFileSrc } from '@tauri-apps/api/core';

const audioElement = new Audio();

audioElement.crossOrigin = 'anonymous';

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let source: MediaElementAudioSourceNode | null = null;

function initWebAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.8;

    source = audioCtx.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
  }

  if( audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

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
    initWebAudio();
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
  },

  getAnalyserData: (dataArray: Uint8Array) => {
    if (analyser) {
      // @ts-expect-error
      analyser.getByteFrequencyData(dataArray);
    }
  }
};