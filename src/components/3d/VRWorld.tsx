// VRWorld.tsx
import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  Stars,
  Float,
  Html,
  Grid,
  PerspectiveCamera,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';

import { WorldGrid } from './world/WorldGrid';
import { CentralPortal } from './world/CentralPortal';
import { FloatingPlatform } from './world/FloatingPlatform';
import { Avatar } from './world/Avatar';
import { AmbientParticles } from './world/AmbientParticles';
import { CameraRig } from './world/CameraRig';
import { WorldHUD } from './world/WorldHUD';

export function VRWorld() {
  const dpr = useMemo<[number, number]>(() => [1, 1.75], []);

  return (
    <div className="w-full h-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
        }}
        dpr={dpr}
        shadows
        camera={{ fov: 60, position: [0, 5, 20] }}
      >
        <color attach="background" args={['#020314']} />
        <fog attach="fog" args={['#050510', 30, 120]} />

        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}

function Scene() {
  return (
    <>
      {/* Cámara + movimiento (WASD + ratón) */}
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={60} />
      <CameraRig />

      {/* Controles de órbita para inspección */}
      <OrbitControls
        enableZoom
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={60}
      />

      {/* Iluminación global */}
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[12, 25, 10]}
        intensity={1}
        color="#9fdbff"
        castShadow
      />

      {/* Entorno HDRI opcional */}
      <Environment preset="night" />

      {/* Cielo */}
      <Stars
        radius={180}
        depth={80}
        count={8000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Mundo base */}
      <WorldGrid />
      <CentralPortal />
      <AmbientParticles />

      {/* Plataformas flotantes (módulos MD‑X4) */}
      <FloatingPlatform
        id="hub-central"
        position={[-15, 2, -5]}
        color="#00d4ff"
        label="Hub Central"
        description="Núcleo civilizacional y social de TAMV"
      />
      <FloatingPlatform
        id="marketplace"
        position={[15, 3, -8]}
        color="#d946ef"
        label="Marketplace"
        description="Economía federada 75/25 para creadores"
      />
      <FloatingPlatform
        id="dreamspace"
        position={[-10, 4, -20]}
        color="#8b5cf6"
        label="DreamSpace"
        description="Espacios oníricos curados por ISABELLA AI"
      />
      <FloatingPlatform
        id="arena"
        position={[12, 2.5, -18]}
        color="#22d3ee"
        label="Arena"
        description="Eventos, conciertos y experiencias en vivo"
      />

      {/* Avatares de ejemplo */}
      <Avatar id="user-1" position={[-12, 1, -3]} color="#00d4ff" />
      <Avatar id="user-2" position={[10, 1, -5]} color="#d946ef" />
      <Avatar id="user-3" position={[-5, 1, -12]} color="#22d3ee" />

      {/* HUD superpuesto (datos de red, tips, etc.) */}
      <WorldHUD />
    </>
  );
}
