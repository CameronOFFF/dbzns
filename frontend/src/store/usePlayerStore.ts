import { create } from 'zustand';

interface PlayerState {
  name: string;
  level: number;
  aurum: number;
  lumen: number;
  setPlayer: (data: Partial<PlayerState>) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  name: 'Nova Lys',
  level: 12,
  aurum: 4200,
  lumen: 80,
  setPlayer: (data) => set((state) => ({ ...state, ...data })),
}));
