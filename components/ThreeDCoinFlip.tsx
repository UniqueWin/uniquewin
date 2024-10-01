"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface CoinProps {
  isFlipping: boolean;
  onFlipComplete: (result: "heads" | "tails") => void;
}

function Coin({ isFlipping, onFlipComplete }: CoinProps) {
  const meshRef = useRef<THREE.Group>(null);
  const animationRef = useRef<{
    flipAxis: THREE.Vector3;
    spinAxis: THREE.Vector3;
    flipSpeed: number;
    spinSpeed: number;
    maxHeight: number;
    duration: number;
    startTime: number;
  } | null>(null);

  const { scene } = useGLTF("/coin1/coin.gltf");

  const coinMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color("#FFD700"),
        metalness: 0.8,
        roughness: 0.2,
      }),
    []
  );

  useEffect(() => {
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = coinMaterial;
      }
    });

    if (meshRef.current) {
      meshRef.current.rotation.z = Math.PI / 2;
    }
  }, [scene, coinMaterial]);

  useEffect(() => {
    if (isFlipping) {
      animationRef.current = {
        flipAxis: new THREE.Vector3(1, 0, 0).applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          Math.random() * Math.PI * 2
        ),
        spinAxis: new THREE.Vector3(0, 1, 0),
        flipSpeed: 8 + Math.random() * 4,
        spinSpeed: 0.2 + Math.random() * 0.3,
        maxHeight: 2.5 + Math.random() * 1.5,
        duration: 1.5 + Math.random() * 0.5,
        startTime: performance.now(),
      };
    } else {
      animationRef.current = null;
    }
  }, [isFlipping]);

  useFrame(() => {
    if (isFlipping && meshRef.current && animationRef.current) {
      const {
        flipAxis,
        spinAxis,
        flipSpeed,
        spinSpeed,
        maxHeight,
        duration,
        startTime,
      } = animationRef.current;
      const elapsedTime = (performance.now() - startTime) / 1000;
      const progress = Math.min(elapsedTime / duration, 1);

      const flipRotation = new THREE.Quaternion().setFromAxisAngle(
        flipAxis,
        flipSpeed * progress * Math.PI * 2
      );

      const spinRotation = new THREE.Quaternion().setFromAxisAngle(
        spinAxis,
        spinSpeed * progress * Math.PI * 2
      );

      meshRef.current.quaternion.multiplyQuaternions(
        flipRotation,
        spinRotation
      );

      const bounceHeight = Math.sin(progress * Math.PI) * maxHeight;
      meshRef.current.position.y = bounceHeight;

      if (progress >= 1) {
        meshRef.current.rotation.set(Math.PI / 2, 0, 0);
        meshRef.current.position.y = 0;
        onFlipComplete(Math.random() < 0.5 ? "heads" : "tails");
      }
    } else if (!isFlipping && meshRef.current) {
      meshRef.current.rotation.set(0, 0, Math.PI / 2);
      meshRef.current.position.y = 0;
    }
  });

  return <primitive object={scene} ref={meshRef} scale={0.1} />;
}

interface ThreeDCoinFlipProps {
  onFlipComplete: (result: "heads" | "tails") => void;
}

export default function ThreeDCoinFlip({
  onFlipComplete,
}: ThreeDCoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
    }
  };

  const handleFlipComplete = (result: "heads" | "tails") => {
    setIsFlipping(false);
    onFlipComplete(result);
  };

  return (
    <div className="w-64 h-64">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 8]}
          fov={60}
          rotation={[-0.2, 0, 0]}
        />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
        <Coin isFlipping={isFlipping} onFlipComplete={handleFlipComplete} />
      </Canvas>
      <button
        onClick={handleFlip}
        disabled={isFlipping}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isFlipping ? "Flipping..." : "Flip Coin"}
      </button>
    </div>
  );
}
