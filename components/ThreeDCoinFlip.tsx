"use client";

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, PerspectiveCamera, Text } from "@react-three/drei";
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
        color: new THREE.Color("#E0E0E0"), // Lighter silver color
        metalness: 0.7, // Reduced metalness
        roughness: 0.3, // Increased roughness slightly
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

    return () => {
      scene.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh) {
          child.material.dispose();
        }
      });
    };
  }, [scene, coinMaterial]);

  const initializeFlip = useCallback(() => {
    return {
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
  }, []);

  useEffect(() => {
    if (isFlipping) {
      animationRef.current = initializeFlip();
    } else {
      animationRef.current = null;
    }
  }, [isFlipping, initializeFlip]);

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

      meshRef.current.quaternion
        .setFromAxisAngle(flipAxis, flipSpeed * progress * Math.PI * 2)
        .multiply(
          new THREE.Quaternion().setFromAxisAngle(
            spinAxis,
            spinSpeed * progress * Math.PI * 2
          )
        );

      meshRef.current.position.y = Math.sin(progress * Math.PI) * maxHeight;

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

  return (
    <group ref={meshRef}>
      <primitive object={scene} scale={0.1} />
    </group>
  );
}

interface ThreeDCoinFlipProps {
  onFlipComplete: (result: "heads" | "tails") => void;
}

function CameraController({ isFlipping, isFlipComplete }: { isFlipping: boolean, isFlipComplete: boolean }) {
  const { camera } = useThree();
  const initialPosition = useMemo(() => new THREE.Vector3(0, 5, 8), []);
  const initialRotation = useMemo(() => new THREE.Euler(-0.2, 0, 0), []);
  const midPosition = useMemo(() => new THREE.Vector3(0, 8, 0), []); // Position directly above the coin
  const finalPosition = useMemo(() => new THREE.Vector3(0, 4, 0), []); // Zoomed in position
  const targetRotation = useMemo(() => new THREE.Euler(-Math.PI / 2, 0, 0), []); // Looking straight down

  const [stage, setStage] = useState(0); // 0: initial, 1: move above, 2: zoom in

  useEffect(() => {
    if (isFlipComplete) {
      setStage(1);
      setTimeout(() => setStage(2), 1000); // Start zoom in after 1 second
    } else {
      setStage(0);
    }
  }, [isFlipComplete]);

  useFrame(() => {
    if (stage === 0) {
      camera.position.lerp(initialPosition, 0.1);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, initialRotation.x, 0.1);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, initialRotation.y, 0.1);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, initialRotation.z, 0.1);
    } else if (stage === 1) {
      camera.position.lerp(midPosition, 0.05);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotation.x, 0.05);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotation.y, 0.05);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, targetRotation.z, 0.05);
    } else if (stage === 2) {
      camera.position.lerp(finalPosition, 0.05);
    }
  });

  return null;
}

function ResultText({ result, isVisible }: { result: string, isVisible: boolean }) {
  const { camera } = useThree();
  const textRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion);
      textRef.current.position.set(0, 0.6, 0);
    }
  });

  if (!isVisible) return null;

  return (
    <Text
      ref={textRef}
      fontSize={0.5}
      color="gold"
      anchorX="center"
      anchorY="middle"
    >
      {result.toUpperCase()}
    </Text>
  );
}

export default function ThreeDCoinFlip({
  onFlipComplete,
}: ThreeDCoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [isFlipComplete, setIsFlipComplete] = useState(false);
  const [flipResult, setFlipResult] = useState<"heads" | "tails" | null>(null);

  const handleFlip = useCallback(() => {
    if (!isFlipping) {
      setIsFlipping(true);
      setIsFlipComplete(false);
      setFlipResult(null);
    }
  }, [isFlipping]);

  const handleFlipComplete = useCallback(
    (result: "heads" | "tails") => {
      setIsFlipping(false);
      setFlipResult(result);
      setTimeout(() => {
        setIsFlipComplete(true);
        onFlipComplete(result);
      }, 500);
    },
    [onFlipComplete]
  );

  return (
    <div className="w-64 h-64">
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 5, 8]}
          fov={60}
          rotation={[-0.2, 0, 0]}
        />
        <CameraController isFlipping={isFlipping} isFlipComplete={isFlipComplete} />
        <ambientLight intensity={0.6} /> {/* Slightly increased ambient light */}
        <directionalLight position={[5, 5, 5]} intensity={1.2} /> {/* Increased intensity and adjusted position */}
        <directionalLight position={[-5, 5, -5]} intensity={0.8} /> {/* Adjusted position and increased intensity */}
        <pointLight position={[0, 3, 0]} intensity={0.5} /> {/* Added a point light above the coin */}
        <Coin isFlipping={isFlipping} onFlipComplete={handleFlipComplete} />
        <ResultText result={flipResult || ""} isVisible={isFlipComplete} />
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
