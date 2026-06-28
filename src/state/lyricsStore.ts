import { create } from 'zustand';

export interface LyricLine {
  time: number;
  text: string;
}

interface LyricsState {
  lines: LyricLine[];
  activeLineIndex: number;
  offsetMs: number;
  
  setLyrics: (lines: LyricLine[]) => void;
  setActiveLine: (index: number) => void;
  resetLyrics: () => void;
  setOffsetMs: (offset: number) => void;
}

export const useLyricsStore = create<LyricsState>((set) => ({
  lines: [],
  activeLineIndex: -1,
  offsetMs: 0,

  setLyrics: (lines) => set({ lines }),
  setActiveLine: (index) => set({ activeLineIndex: index }),
  resetLyrics: () => set({ lines: [], activeLineIndex: -1, offsetMs: 0 }),
  setOffsetMs: (offset) => set({ offsetMs: offset}),
}));