import { usePlayerStore } from '../state/playerStore';
import { useLyricsStore } from '../state/lyricsStore';

const audioElement = new Audio();

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

    loadSong: (file: File) => {
        const objectUrl = URL.createObjectURL(file);
        audioElement.src = objectUrl;
        audioElement.load();
        usePlayerStore.getState().setCurrentSong(file.name);
    }
};