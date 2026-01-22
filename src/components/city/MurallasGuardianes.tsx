import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Anubis Wall Segment
function AnubisWall({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const wallRef = useRef<THREE.Mesh>(null);
  const [alert, setAlert] = useState(false);

  useFrame((state) => {
    if (wallRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      (wallRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = alert ? 0.8 : 0.2 + pulse;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Main Wall */}
      <mesh ref={wallRef} position={[0, 10, 0]}>
        <boxGeometry args={[30, 20, 1]} />
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.2}
          metalness={0.8}
          emissive="#ff0000"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Wall Patterns (Circuit-like) */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[-12 + i * 6, 10, 0.6]}>
          <boxGeometry args={[0.1, 18, 0.1]} />
          <meshStandardMaterial
            color="#ff0000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      
      {/* Defensive Turrets */}
      <mesh position={[-12, 22, 0]}>
        <coneGeometry args={[1.5, 3, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[12, 22, 0]}>
        <coneGeometry args={[1.5, 3, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// Horus Eye Tower
function HorusEyeTower({ position }: { position: [number, number, number] }) {
  const eyeRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (eyeRef.current) {
      // Eye scanning motion
      eyeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
      eyeRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
    if (beamRef.current) {
      beamRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      (beamRef.current.material as THREE.MeshStandardMaterial).opacity = 
        0.1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* Tower Body */}
      <mesh position={[0, 15, 0]}>
        <cylinderGeometry args={[2, 3, 30, 6]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
          emissive="#d4af37"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Eye Platform */}
      <mesh position={[0, 32, 0]}>
        <cylinderGeometry args={[4, 3, 2, 6]} />
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* The Eye */}
      <group ref={eyeRef} position={[0, 35, 0]}>
        <mesh>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Pupil */}
        <mesh position={[0, 0, 1.8]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial
            color="#000000"
            emissive="#ff0000"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Scanning Beam */}
        <mesh ref={beamRef} position={[0, 0, 10]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[5, 20, 32, 1, true]} />
          <meshStandardMaterial
            color="#d4af37"
            emissive="#d4af37"
            emissiveIntensity={0.3}
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      
      <pointLight position={[0, 35, 0]} color="#d4af37" intensity={2} distance={50} />
    </group>
  );
}

// Dekateotl Balance Temple
function DekateotlTemple() {
  const balanceRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (balanceRef.current) {
      // Dynamic balance based on "justice"
      const newBalance = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
      balanceRef.current.rotation.z = newBalance;
    }
  });

  return (
    <group position={[0, 0, -50]}>
      {/* Temple Base */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[20, 4, 15]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.2}
          metalness={0.8}
          emissive="#00d4ff"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Central Pillar */}
      <mesh position={[0, 12, 0]}>
        <cylinderGeometry args={[1, 1.5, 16, 8]} />
        <meshStandardMaterial
          color="#0f0f1a"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {/* Balance Beam */}
      <group ref={balanceRef} position={[0, 20, 0]}>
        <mesh>
          <boxGeometry args={[16, 0.5, 1]} />
          <meshStandardMaterial
            color="#d4af37"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>
        
        {/* Left Scale */}
        <mesh position={[-7, -2, 0]}>
          <cylinderGeometry args={[2, 2, 0.3, 32]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {/* Right Scale */}
        <mesh position={[7, -2, 0]}>
          <cylinderGeometry args={[2, 2, 0.3, 32]} />
          <meshStandardMaterial
            color="#ff00ff"
            emissive="#ff00ff"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Justice Light */}
      <pointLight position={[0, 25, 0]} color="#d4af37" intensity={2} distance={40} />
      
      {/* Inscription */}
      <Html center position={[0, 5, 8]} distanceFactor={20}>
        <div className="font-display text-gold text-lg tracking-widest">
          DEKATEOTL
        </div>
      </Html>
    </group>
  );
}

// Aztec God Energy Node
function AztecNode({ position, name, color }: { position: [number, number, number]; name: string; color: string }) {
  const nodeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (nodeRef.current) {
      nodeRef.current.rotation.y += 0.01;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      nodeRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      {/* Pyramid Base */}
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[4, 6, 4]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.3}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Energy Sphere */}
      <mesh ref={nodeRef} position={[0, 8, 0]}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <pointLight position={[0, 8, 0]} color={color} intensity={1} distance={20} />
      
      <Html center position={[0, 11, 0]} distanceFactor={15}>
        <div className="font-display text-xs" style={{ color }}>
          {name}
        </div>
      </Html>
    </group>
  );
}

export function MurallasGuardianes() {
  const wallSegments = [
    { position: [0, 0, 60] as [number, number, number], rotation: [0, 0, 0] as [number, number, number] },
    { position: [0, 0, -60] as [number, number, number], rotation: [0, Math.PI, 0] as [number, number, number] },
    { position: [60, 0, 0] as [number, number, number], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
    { position: [-60, 0, 0] as [number, number, number], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  ];

  const horusTowers = [
    [50, 0, 50] as [number, number, number],
    [-50, 0, 50] as [number, number, number],
    [50, 0, -50] as [number, number, number],
    [-50, 0, -50] as [number, number, number],
  ];

  const aztecNodes = [
    { position: [30, 0, 30] as [number, number, number], name: 'QUETZALCOATL', color: '#00ff88' },
    { position: [-30, 0, 30] as [number, number, number], name: 'TEZCATLIPOCA', color: '#000000' },
    { position: [30, 0, -30] as [number, number, number], name: 'HUITZILOPOCHTLI', color: '#ff0000' },
    { position: [-30, 0, -30] as [number, number, number], name: 'TLALOC', color: '#00d4ff' },
  ];

  return (
    <group>
      {/* Anubis Walls */}
      {wallSegments.map((segment, i) => (
        <AnubisWall key={i} position={segment.position} rotation={segment.rotation} />
      ))}
      
      {/* Horus Eye Towers */}
      {horusTowers.map((pos, i) => (
        <HorusEyeTower key={i} position={pos} />
      ))}
      
      {/* Dekateotl Temple */}
      <DekateotlTemple />
      
      {/* Aztec Energy Nodes */}
      {aztecNodes.map((node, i) => (
        <AztecNode key={i} {...node} />
      ))}
      
      {/* Defense Grid on Ground */}
      <gridHelper args={[150, 30, '#ff0000', '#330000']} position={[0, 0.1, 0]} />
    </group>
  );
}
