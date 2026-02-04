import { type StateCreator } from "zustand";
import { Euler, Vector3 } from "three";

export interface RemotePlayer {
  id: string;
  position: Vector3;
  rotation: Euler;
  room: string;
}

export interface PlayerSlice {
  remotePlayers: Map<string, RemotePlayer>;
  syncPlayers: (players: RemotePlayer[]) => void;
  removePlayer: (id: string) => void;
}

export const createPlayerSlice: StateCreator<
  PlayerSlice,
  [],
  [],
  PlayerSlice
> = (set) => ({
  remotePlayers: new Map(),
  syncPlayers: (players) =>
    set(() => {
      const nextMap = new Map<string, RemotePlayer>();
      players.forEach((p) => nextMap.set(p.id, p));
      return { remotePlayers: nextMap };
    }),
  removePlayer: (id) =>
    set((state) => {
      const newMap = new Map(state.remotePlayers);
      newMap.delete(id);
      return { remotePlayers: newMap };
    }),
});
