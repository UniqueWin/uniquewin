"use client";

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text, PerspectiveCamera, Stats } from '@react-three/drei'
import * as THREE from 'three'

interface CoinProps {
  isFlipping: boolean;
  onFlipComplete: (result: 'heads' | 'tails') => void;
}

function Coin({ isFlipping, onFlipComplete }: CoinProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  
  const goldMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#FFD700"),
      side: THREE.DoubleSide,
    });
  }, []);

  const { gl } = useThree();
  
  useEffect(() => {
    console.log('Renderer:', gl.info.render)
    console.log('Programs:', gl.info.programs)
  }, [gl]);

  useFrame(() => {
    if (isFlipping) {
      setRotation((prev) => {
        const newRotation = {
          x: prev.x + 0.2,
          y: prev.y + 0.1,
          z: prev.z + 0.15
        }
        if (newRotation.x >= Math.PI * 10) {
          onFlipComplete(Math.random() < 0.5 ? 'heads' : 'tails')
          return { x: 0, y: 0, z: 0 }
        }
        return newRotation
      })
    }
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation.x
      meshRef.current.rotation.y = rotation.y
      meshRef.current.rotation.z = rotation.z
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <cylinderGeometry args={[1, 1, 0.1, 64]} />
        <primitive object={goldMaterial} attach="material" />
      </mesh>
      <Text
        position={[0, 0.06, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.5}
        color="black"
      >
        H
      </Text>
      <Text
        position={[0, -0.06, 0]}
        rotation={[Math.PI, 0, 0]}
        fontSize={0.5}
        color="black"
      >
        T
      </Text>
    </group>
  )
}

interface ThreeDCoinFlipProps {
  onFlipComplete: (result: 'heads' | 'tails') => void;
}

export default function ThreeDCoinFlip({ onFlipComplete }: ThreeDCoinFlipProps) {
  const [isFlipping, setIsFlipping] = useState(false)

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true)
    }
  }

  const handleFlipComplete = (result: 'heads' | 'tails') => {
    setIsFlipping(false)
    onFlipComplete(result)
  }

  return (
    <div className="w-64 h-64">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.7} /> {/* Increased intensity */}
        <pointLight position={[10, 10, 10]} intensity={1.5} /> {/* Increased intensity */}
        <pointLight position={[-10, -10, -10]} intensity={1.5} /> {/* Added another light source */}
        <Coin isFlipping={isFlipping} onFlipComplete={handleFlipComplete} />
      </Canvas>
      <button
        onClick={handleFlip}
        disabled={isFlipping}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {isFlipping ? 'Flipping...' : 'Flip Coin'}
      </button>
    </div>
  )
}