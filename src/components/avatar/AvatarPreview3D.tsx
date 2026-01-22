import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { AvatarConfig, DEFAULT_AVATAR } from '@/hooks/useAvatarSystem';

interface AvatarMeshProps {
  config: AvatarConfig;
}

function AvatarMesh({ config }: AvatarMeshProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const skinColor = new THREE.Color(config.skinTone);
  const hairColor = new THREE.Color(config.hairColor);
  const eyeColor = new THREE.Color(config.eyeColor);
  const outfitColor = new THREE.Color(config.outfitColor);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        {/* Aura effect */}
        {config.aura !== 'none' && (
          <mesh scale={[1.5, 2, 1.5]}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial
              color={config.aura === 'cyan' ? '#00d4ff' : config.aura === 'magenta' ? '#ff00ff' : '#d4af37'}
              transparent
              opacity={0.1}
            />
          </mesh>
        )}

        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>

        {/* Eyes */}
        <group position={[0, 1.55, 0.25]}>
          {/* Left eye */}
          <mesh position={[-0.1, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[-0.1, 0, 0.03]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.3} />
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.1, 0, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0.1, 0, 0.03]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.3} />
          </mesh>
        </group>

        {/* Hair based on style */}
        {config.hairStyle !== 'bald' && (
          <mesh position={[0, 1.7, 0]}>
            {config.hairStyle === 'short' && <sphereGeometry args={[0.38, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />}
            {config.hairStyle === 'long' && <cylinderGeometry args={[0.35, 0.3, 0.8, 16]} />}
            {config.hairStyle === 'mohawk' && <coneGeometry args={[0.1, 0.5, 8]} />}
            {config.hairStyle === 'ponytail' && <sphereGeometry args={[0.38, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />}
            {config.hairStyle === 'afro' && <sphereGeometry args={[0.5, 16, 16]} />}
            <meshStandardMaterial color={hairColor} roughness={0.7} />
          </mesh>
        )}

        {/* Body/Torso */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.8, 16]} />
          <meshStandardMaterial 
            color={outfitColor} 
            roughness={0.3}
            metalness={0.5}
            emissive={outfitColor}
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.4, 0.85, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.4, 0.85, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.08, 0.5, 8, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.5} />
        </mesh>

        {/* Legs */}
        <mesh position={[-0.12, 0.15, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
        </mesh>
        <mesh position={[0.12, 0.15, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 8, 16]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.5} />
        </mesh>

        {/* Accessories */}
        {config.accessories.includes('glasses') && (
          <group position={[0, 1.55, 0.3]}>
            <mesh position={[-0.1, 0, 0]}>
              <ringGeometry args={[0.06, 0.08, 16]} />
              <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.1, 0, 0]}>
              <ringGeometry args={[0.06, 0.08, 16]} />
              <meshStandardMaterial color="#2a2a2a" side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
          </group>
        )}

        {config.accessories.includes('crown') && (
          <mesh position={[0, 1.95, 0]}>
            <coneGeometry args={[0.25, 0.2, 5]} />
            <meshStandardMaterial 
              color="#d4af37" 
              metalness={0.9} 
              roughness={0.1}
              emissive="#d4af37"
              emissiveIntensity={0.3}
            />
          </mesh>
        )}

        {config.accessories.includes('halo') && (
          <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.3, 0.03, 16, 32]} />
            <meshStandardMaterial 
              color="#ffd700"
              emissive="#ffd700"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}

        {config.accessories.includes('mask') && (
          <mesh position={[0, 1.5, 0.25]}>
            <boxGeometry args={[0.5, 0.2, 0.1]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
        )}
      </group>
    </Float>
  );
}

interface AvatarPreview3DProps {
  config?: AvatarConfig;
}

export function AvatarPreview3D({ config = DEFAULT_AVATAR }: AvatarPreview3DProps) {
  return (
    <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-5, 3, -5]} intensity={0.5} color="#ff00ff" />
      <spotLight position={[0, 5, 0]} intensity={0.8} angle={0.5} penumbra={1} />
      
      <AvatarMesh config={config} />
      
      <Environment preset="night" />
    </Canvas>
  );
}
