// world/Avatar.tsx
import { Float } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

type AvatarProps = {
  id: string;
  position: [number, number, number];
  color: string;
};

export function Avatar({ id, position, color }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 2.3) * 0.12;
  });

  return (
    <Float speed={3} rotationIntensity={0.55}>
      <group ref={groupRef} position={position} name={id}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <capsuleGeometry args={[0.3, 0.8, 10, 18]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.35}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.25, 18, 18]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.35}
          />
        </mesh>

        <pointLight color={color} intensity={1.1} distance={3.5} />
      </group>
    </Float>
  );
}
