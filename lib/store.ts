import { create } from "zustand";

interface GameStore {
  selectedBiome: "Desert" | "Rift" | "Glacier" | null;
  selectedDepth: 1 | 2 | 3 | null;
  selectedMode: "drill" | "blast" | null;
  setSelectedBiome: (biome: "Desert" | "Rift" | "Glacier" | null) => void;
  setSelectedDepth: (depth: 1 | 2 | 3 | null) => void;
  setSelectedMode: (mode: "drill" | "blast" | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  selectedBiome: null,
  selectedDepth: null,
  selectedMode: null,
  setSelectedBiome: (biome) => set({ selectedBiome: biome }),
  setSelectedDepth: (depth) => set({ selectedDepth: depth }),
  setSelectedMode: (mode) => set({ selectedMode: mode }),
}));

