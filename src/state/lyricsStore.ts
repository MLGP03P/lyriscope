import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Importurile pentru memorie

export interface LyricLine {
  time: number;
  text: string;
}

interface LyricsState {
  lines: LyricLine[];
  activeLineIndex: number;
  offsetMs: number;
  

  savedOffsets: Record<string, number>; 
  currentSongId: string | null;

  blurAmount: number;
  
  setLyrics: (lines: LyricLine[]) => void;
  setActiveLine: (index: number) => void;
  resetLyrics: () => void;
  
  setOffsetMs: (offset: number) => void;
  setCurrentSongId: (id: string | null) => void;
  setBlurAmount: (amount: number) => void;
}

export const useLyricsStore = create<LyricsState>()(
  persist(
    (set, get) => ({
      lines: [],
      activeLineIndex: -1,
      offsetMs: 0,
      savedOffsets: {},
      currentSongId: null,
      blurAmount: 60,
      setLyrics: (lines) => set({ lines }),
      setActiveLine: (index) => set({ activeLineIndex: index }),
      
      resetLyrics: () => set({ 
        lines: [], 
        activeLineIndex: -1, 
        offsetMs: 0, 
        currentSongId: null 
      }),
      
      setOffsetMs: (offset) => {
        const songId = get().currentSongId;
        
        if (songId) {
          set((state) => ({
            offsetMs: offset,
            savedOffsets: { ...state.savedOffsets, [songId]: offset }
          }));
        } else {
          set({ offsetMs: offset });
        }
      },
      
      setCurrentSongId: (id) => {
        const savedOffset = id ? (get().savedOffsets[id] || 0) : 0;
        set({ currentSongId: id, offsetMs: savedOffset });
      },

      setBlurAmount: (blurAmount) => set({ blurAmount }),
    }),
    {
      name: 'lyriscope-lyrics-settings',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ savedOffsets: state.savedOffsets, blurAmount: state.blurAmount }), 
    }
  )
);