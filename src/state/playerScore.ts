import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 

interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  currentSongPath: string | null;
  recentSong: string | null;
  
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setCurrentSong: (path: string) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      isPlaying: false,
      volume: 1.0,
      currentTime: 0,
      duration: 0,
      currentSongPath: null,
      recentSong: null,

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      
      setCurrentSong: (path) => set({ 
        currentSongPath: path, 
        recentSong: path, 
        isPlaying: true 
      }),
    }),
    {
      name: 'lyriscope-storage',
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        volume: state.volume, 
        recentSong: state.recentSong 
      }),
    }
  )
);