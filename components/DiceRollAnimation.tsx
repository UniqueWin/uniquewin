"use client";

import React, { useState, useCallback, useRef } from 'react';
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import Dice from './Dice';

interface CameraControllerProps {
  isRolling: boolean;
  isRollComplete: boolean;
}

function CameraController({ isRolling, isRollComplete }: CameraControllerProps) {
  const { camera } = useThree();
  const initialPosition = useRef(new THREE.Vector3(0, 5, 8));
  const initialRotation = useRef(new THREE.Euler(-0.2, 0, 0));
  const finalPosition = useRef(new THREE.Vector3(0, 4, 0));
  const finalRotation = useRef(new THREE.Euler(-Math.PI / 2, 0, 0));

  const [stage, setStage] = useState(0); // 0: initial, 1: move above, 2: zoom in

  useFrame(() => {
    if (isRollComplete) {
      if (stage === 0) {
        setStage(1);
      } else if (stage === 1) {
        camera.position.lerp(new THREE.Vector3(0, 8, 0), 0.05);
        camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, finalRotation.current.x, 0.05);
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, finalRotation.current.y, 0.05);
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, finalRotation.current.z, 0.05);
        if (camera.position.distanceTo(new THREE.Vector3(0, 8, 0)) < 0.1) {
          setStage(2);
        }
      } else if (stage === 2) {
        camera.position.lerp(finalPosition.current, 0.05);
      }
    } else {
      camera.position.lerp(initialPosition.current, 0.1);
      camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, initialRotation.current.x, 0.1);
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, initialRotation.current.y, 0.1);
      camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, initialRotation.current.z, 0.1);
      setStage(0);
    }
  });

  return null;
}

interface DiceRollAnimationProps {
  onRollComplete: (result: number) => void;
}

const DiceRollAnimation: React.FC<DiceRollAnimationProps> = ({ onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [isRollComplete, setIsRollComplete] = useState(false);

  const handleRoll = useCallback(() => {
    if (!isRolling) {
      setIsRolling(true);
      setIsRollComplete(false);
    }
  }, [isRolling]);

  const handleRollComplete = useCallback((result: number) => {
    setIsRolling(false);
    setTimeout(() => {
      setIsRollComplete(true);
      onRollComplete(result);
    }, 500);
  }, [onRollComplete]);

  return (
    <div className="w-64 h-64 relative">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 5, 8]} fov={60} />
        <CameraController isRolling={isRolling} isRollComplete={isRollComplete} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Dice isRolling={isRolling} onRollComplete={handleRollComplete} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </Canvas>
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isRolling ? "Rolling..." : "Roll Dice"}
      </button>
    </div>
  );
};

export default DiceRollAnimation;