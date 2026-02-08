import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * IsabellaField — Campo de consciencia ambiental.
 * Partículas sutiles que representan la presencia de Isabella en el mundo.
 */
export function IsabellaField() {
  const ref = useRef<THREE.Points>(null);

  const positions = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 20 + 2;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
  }

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={600}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#7dd3fc"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  );
}
