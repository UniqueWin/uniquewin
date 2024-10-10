"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface DiceProps {
  isRolling: boolean;
  onRollComplete: (result: number) => void;
}

function Dice({ isRolling, onRollComplete }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rollRef = useRef({
    rotationSpeed: new THREE.Vector3(),
    rollTime: 0,
  });

  // Create textures for each side of the dice
  const diceTextures = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].map((number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 128, 128);
      ctx.font = "bold 64px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "black";
      ctx.fillText(number.toString(), 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      console.log(`Texture for ${number}:`, texture);
      return texture;
    });
  }, []);

  // Create materials using the textures
  const diceMaterial = useMemo(() => {
    return diceTextures.map((texture) => {
      return new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.1,
        roughness: 0.5,
      });
    });
  }, [diceTextures]);

  useFrame((state, delta) => {
    if (isRolling && meshRef.current) {
      rollRef.current.rollTime += delta;

      // Apply rotation to the mesh
      meshRef.current.rotation.x += rollRef.current.rotationSpeed.x * delta;
      meshRef.current.rotation.y += rollRef.current.rotationSpeed.y * delta;
      meshRef.current.rotation.z += rollRef.current.rotationSpeed.z * delta;

      // After rolling for 2 seconds, generate a result
      if (rollRef.current.rollTime > 2) {
        const result = Math.floor(Math.random() * 6) + 1;
        onRollComplete(result);
        rollRef.current.rollTime = 0;
        rollRef.current.rotationSpeed.set(0, 0, 0);
      }
    } else if (!isRolling && rollRef.current.rollTime === 0) {
      meshRef.current!.position.set(0, 0, 0);
      meshRef.current!.rotation.set(0, 0, 0);
      rollRef.current.rotationSpeed.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      {/* Use a single material for the dice */}
      <meshStandardMaterial
        map={diceMaterial[0].map} // Use the first material as an example
      />
    </mesh>
  );
}

export default Dice;
