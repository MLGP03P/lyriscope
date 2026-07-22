import { create } from 'zustand';

interface UiState {
    currentPage: 'player' | 'library';
    setCurrentPage: (page: 'player' | 'library') => void;
}

export const useUiStore = create<UiState>((set) => ({
    currentPage: 'library',
    setCurrentPage: (page) => set({ currentPage: page }),
}));
