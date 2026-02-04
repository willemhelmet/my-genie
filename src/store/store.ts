import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";
import { type PlayerSlice, createPlayerSlice } from "./playerSlice";

export type StoreState = GameSlice & PlayerSlice;

export const useMyStore = create<StoreState>()(
  (...a) => ({
    ...createGameSlice(...a),
    ...createPlayerSlice(...a),
  }),
);
