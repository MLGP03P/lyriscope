import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface LibrarySong {
  path: string;
  title: string | null;
  artist: string | null;
  album: string | null;
  duration: number | null;
}

interface LibraryState {
  songs: LibrarySong[];
  isScanning: boolean;
  setScanning: (status: boolean) => void;
  addSongs: (songs: LibrarySong[]) => void;
  clearLibrary: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      songs: [],
      isScanning: false,
      setScanning: (status) => set({ isScanning: status }),
      
      addSongs: (newSongs) => set((state) => {
        const existingPaths = new Set(state.songs.map(s => s.path));
        const uniqueNewSongs = newSongs.filter(s => !existingPaths.has(s.path));
        return { songs: [...state.songs, ...uniqueNewSongs] };
      }),
      
      clearLibrary: () => set({ songs: [] }),
    }),
    {
      name: 'lyriscope-library',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ songs: state.songs }),
    }
  )
);