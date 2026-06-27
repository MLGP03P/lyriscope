import { usePlayerStore } from '../state/playerScore';

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

    loadSong: (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        audioElement.src = objectUrl;
        audioElement.load();
        usePlayerStore.getState().setCurrentSong(file.name);
    }
};