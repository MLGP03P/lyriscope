import { usePlayerStore } from '../state/playerScore';
import { convertFileSrc } from '@tauri-apps/api/core';

const audioElement = new Audio();

audioElement.addEventListener('timeupdate', () => {
    usePlayerStore.getState().setCurrentTime(audioElement.currentTime);
});

audioElement.addEventListener('loadmetadata', () => {
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

    
}