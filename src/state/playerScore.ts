import { create } from 'zustand';

interface PlayerState{
    isPlaying: boolean;
    volume: number;
    currentTime: number;
    duration: number;
    currentSongPath: string | null;

    setIsPlaying: (isPlaying: boolean) => void;
    setVolume: (volume: number) => void;
    setCurrentTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setCurrentSong: (path: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    isPlaying: false,
    volume: 1.0,
    currentTime: 0,
    duration: 0,
    currentSongPath: null,

    setIsPlaying: (isPlaying) => set({ isPlaying}),
    setVolume: (volume) => set({ volume }),
    setCurrentTime: (currentTime) => set({ currentTime }),
    setDuration: (duration) => set({duration}),
    setCurrentSong: (path) => set({ currentSongPath: path, isPlaying: true})
}));