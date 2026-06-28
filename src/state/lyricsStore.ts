import { create } from 'zustand';

export interface LyricLine {
  time: number;
  text: string;
}

interface LyricsState {
  lines: LyricLine[];
  activeLineIndex: number;
  
  setLyrics: (lines: LyricLine[]) => void;
  setActiveLine: (index: number) => void;
  resetLyrics: () => void;
}

export const useLyricsStore = create<LyricsState>((set) => ({
  lines: [],
  activeLineIndex: -1,

  setLyrics: (lines) => set({ lines }),
  setActiveLine: (index) => set({ activeLineIndex: index }),
  resetLyrics: () => set({ lines: [], activeLineIndex: -1 }),
}));