import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; 


export interface HistoryItem{
  path: string;
  title: string;
  artist: string;
}
interface PlayerState {
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  currentSongPath: string | null;
  recentSong: string | null;

  title: string | null;
  artist: string | null;
  coverUrl: string | null;
  
  history: HistoryItem[];

  queue: string[];
  currentQueueIndex: number;

  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setCurrentSong: (path: string) => void;

  setMetadata: (title: string | null, artist: string | null) => void;
  setCoverUrl: (url: string | null) => void;

  addToHistory: (item: HistoryItem) => void;

  setQueue: (paths: string[], startIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      volume: 1.0,
      currentTime: 0,
      duration: 0,
      currentSongPath: null,
      recentSong: null,

      title: null,
      artist: null,
      coverUrl: null,
      history: [],

      queue: [],
      currentQueueIndex: -1,

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      
      setCurrentSong: (path) => set({ 
        currentSongPath: path, 
        recentSong: path, 
        isPlaying: true,

        title: null,
        artist: null,
        coverUrl: null
      }),
      setMetadata: (title, artist) => set({ title, artist }),
      setCoverUrl: (url) => set({ coverUrl: url }),

      addToHistory: (item) => set((state) => {
        const filtered = state.history.filter((s) => s.path !== item.path);
        return { history: [item, ...filtered].slice(0, 10)};
      }),

      setQueue: (paths, startIndex) => set({ queue: paths, currentQueueIndex: startIndex }),

      playNext: () => {
        const { queue, currentQueueIndex } = get();
        if (queue.length === 0 || currentQueueIndex === -1) return;

        if (currentQueueIndex < queue.length - 1) {
          const nextIndex = currentQueueIndex + 1;
          set({ currentQueueIndex: nextIndex});
          (window as any).triggerGlobalSongLoad(queue[nextIndex]);
        }
      },

      playPrevious: () => {
        const { queue, currentQueueIndex } = get();
        if(queue.length === 0 || currentQueueIndex === -1) return;

        if (currentQueueIndex > 0) {
          const prevIndex = currentQueueIndex - 1;
          set({ currentQueueIndex: prevIndex});
          (window as any).triggerGlobalSongLoad(queue[prevIndex]);
        }
      }
    }),

    {
      name: 'lyriscope-storage',
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ 
        volume: state.volume, 
        history: state.history,
      }),
    }
  )
);