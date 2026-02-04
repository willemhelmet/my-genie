import { type StateCreator } from "zustand";

export type GameStatus = "intro" | "generate" | "review" | "playing" | "paused";

export interface GameSlice {
  status: GameStatus;
  isMobile: boolean;
  prompt: string;
  generatedImage: string | null;
  sceneUrl: string | null;
  start: () => void;
  pause: () => void;
  resume: () => void;
  setPrompt: (prompt: string) => void;
  setGeneratedImage: (url: string | null) => void;
  setSceneUrl: (url: string) => void;
  setGameStatus: (status: GameStatus) => void;
}

export const createGameSlice: StateCreator<
  GameSlice,
  [],
  [],
  GameSlice
> = (set) => ({
  status: "intro",
  isMobile: "ontouchstart" in window || navigator.maxTouchPoints > 0,
  prompt: "",
  generatedImage: null,
  sceneUrl: null,
  start: () => set(() => ({ status: "playing" })),
  pause: () => set(() => ({ status: "paused" })),
  resume: () => set(() => ({ status: "playing" })),
  setPrompt: (prompt) => set(() => ({ prompt })),
  setGeneratedImage: (url) => set(() => ({ generatedImage: url })),
  setSceneUrl: (url) => set(() => ({ sceneUrl: url })),
  setGameStatus: (status) => set(() => ({ status })),
});