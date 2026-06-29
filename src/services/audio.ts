import { usePlayerStore } from '../state/playerStore';
import { useLyricsStore } from '../state/lyricsStore';
import {convertFileSrc } from '@tauri-apps/api/core';

const audioElement = new Audio();
// Radar pentru erori de redare!
audioElement.addEventListener('error', () => {
  console.error("🔴 Eroare Motor Audio! Cod:", audioElement.error?.code, "Mesaj:", audioElement.error?.message);
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
    usePlayerStore.getState().setIsPlaying(false);
});

export const audioService ={
    play: async () =>{
        await audioElement.play();
        usePlayerStore.getState().setIsPlaying(true);
    },

    pause: () => {
        audioElement.pause();
        usePlayerStore.getState().setIsPlaying(false);
    },

    seek: (time: number) => {
        audioElement.currentTime=time;
        usePlayerStore.getState().setCurrentTime(time);
    },

    setVolume: (volume: number) => {
        audioElement.volume = volume;
        usePlayerStore.getState().setVolume(volume);
    },

    loadSong: (path: string) => {
        const assetUrl = convertFileSrc(path);
        console.log("🔗 4. Link-ul sigur generat pentru player este:", assetUrl);
        audioElement.src = assetUrl;
        audioElement.load();
        const fileName = path.split(/[/\\]/).pop() || "Song";
        usePlayerStore.getState().setCurrentSong(fileName);
    }
};