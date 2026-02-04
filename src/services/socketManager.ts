import { io, Socket } from "socket.io-client";
import { useMyStore } from "../store/store";
import { Vector3, Euler } from "three";
import { type RemotePlayer } from "../store/playerSlice";

interface RawPlayer {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  room: string;
}

interface ServerToClientEvents {
  players: (players: RawPlayer[]) => void;
}

interface ClientToServerEvents {
  join_scene: (sceneName: string) => void;
  move: (
    position: [number, number, number],
    rotation: [number, number, number],
  ) => void;
}

class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = 
    null;

  public connect() {
    if (this.socket?.connected) return;

    // Assumes server is running on localhost:3000 during dev
    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.joinRoom("default");
    });

    this.socket.on("players", (rawPlayers) => {
      const myId = this.socket?.id;
      const formattedOthers: RemotePlayer[] = rawPlayers
        .filter((p) => p.id !== myId)
        .map((p) => ({
          id: p.id,
          position: new Vector3(...p.position),
          rotation: new Euler(...p.rotation),
          room: p.room,
        }));

      useMyStore.getState().syncPlayers(formattedOthers);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinRoom(sceneName: string) {
    if (!this.socket) return;
    this.socket.emit("join_scene", sceneName);
  }

  public sendMovement(position: Vector3, rotation: Euler) {
    if (!this.socket) return;
    this.socket.emit("move", position.toArray(), [
      rotation.x,
      rotation.y,
      rotation.z,
    ]);
  }
}

export const socketManager = new SocketManager();
