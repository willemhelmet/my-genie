import BVHEcctrl, { characterStatus } from "bvhecctrl";
import { useThree, useFrame } from "@react-three/fiber";
import { useMyStore } from "../store/store.ts";
import { useEffect } from "react";

export const Player = () => {
  const camera = useThree((state) => state.camera);
  const status = useMyStore((state) => state.status);
  const paused = status !== "playing";

  useEffect(() => {
    // Ensure rotation order avoids gimbal lock issues
    // eslint-disable-next-line react-hooks/immutability
    camera.rotation.order = "YXZ";
  }, [camera]);

  useFrame(() => {
    if (!paused) {
      // Update camera position to follow the player
      camera.position.copy(characterStatus.position);
      camera.position.set(
        camera.position.x,
        camera.position.y + 0.8,
        camera.position.z,
      );
    }
  });

  return <BVHEcctrl position={[0, 0.8, 0]} debug={false} paused={paused} delay={0.5} />;
};
