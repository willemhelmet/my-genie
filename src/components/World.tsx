import { Canvas } from "@react-three/fiber";
import {
  CameraControls,
  KeyboardControls,
  PointerLockControls,
} from "@react-three/drei";
import { Scene } from "../Scene.tsx";
import { MobileControls } from "./MobileControls.tsx";
import { useMyStore } from "../store/store.ts";
import { PauseMenu } from "./ui/PauseMenu.tsx";

export const World = () => {
  const isMobile = useMyStore((state) => state.isMobile);
  const status = useMyStore((state) => state.status);
  const start = useMyStore((state) => state.start);
  const pause = useMyStore((state) => state.pause);
  const resume = useMyStore((state) => state.resume);

  const handleUnlock = () => {
    if (status === "playing") {
      pause();
    }
  };

  const handleLock = () => {
    resume();
  };

  return (
    <>
      {status === "paused" && <PauseMenu />}
      {status === "intro" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl text-white font-mono p-4">
          <div className="border-2 border-white p-12 text-center space-y-8 max-w-lg">
            <h2 className="text-3xl font-bold tracking-widest text-blue-400">
              WORLD LOADED
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest leading-loose">
              Neural environment stabilized.
              <br />
              Spatial mapping complete.
            </p>
            <button
              id="playButton"
              onClick={start}
              className="w-full py-4 bg-white text-black text-xl font-bold hover:bg-blue-400 hover:text-white transition-all cursor-pointer"
            >
              BEGIN EXPLORATION
            </button>
            <p className="text-[10px] text-gray-600">
              Clicking will capture cursor for navigation.
              <br />
              ESC to release.
            </p>
          </div>
        </div>
      )}
      <div className="flex h-screen w-screen">
        <KeyboardControls
          map={[
            { name: "forward", keys: ["ArrowUp", "KeyW"] },
            { name: "backward", keys: ["ArrowDown", "KeyS"] },
            { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
            { name: "rightward", keys: ["ArrowRight", "KeyD"] },
            { name: "pause", keys: ["Escape"] },
          ]}
        >
          {isMobile && status === "playing" && <MobileControls />}
          <Canvas
            gl={{ antialias: false }}
            dpr={1}
            camera={{
              position: [0, 1.5, 0],
              rotation: [0, 0, 0],
            }}
          >
            <Scene />
            {!isMobile && (
              <PointerLockControls
                selector="#playButton"
                onUnlock={handleUnlock}
                onLock={handleLock}
              />
            )}
            {isMobile && <CameraControls smoothTime={0} />}
          </Canvas>
        </KeyboardControls>
      </div>
    </>
  );
};
