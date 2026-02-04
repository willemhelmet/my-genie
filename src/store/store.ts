import { create } from "zustand";
import { type GameSlice, createGameSlice } from "./gameSlice";

export type StoreState = GameSlice;

export const useMyStore = create<StoreState>()(
  (...a) => ({
    ...createGameSlice(...a),
  }),
);