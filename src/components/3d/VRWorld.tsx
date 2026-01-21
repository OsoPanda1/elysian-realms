import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Stars, 
  Float, 
  Text3D, 
  Center,
  Environment,
  Grid,
  PerspectiveCamera,
  useTexture,
  Html
} from '@react-three/drei';
import * as THREE from 'three';

// Ground Grid
function WorldGrid() {
  return (
    <Grid
      position={[0, -0.5, 0]}
      args={[100, 100]}
      cellSize={2}
      cellThickness={0.5}
      cellColor="#00d4ff"
      sectionSize={10}
      sectionThickness={1}
      sectionColor="#d946ef"
      fadeDistance={50}
      fadeStrength={1}
      infiniteGrid
    />
  );
}

// Central Portal
function CentralPortal() {
  const portalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[0, 3, -15]}>
      {/* Outer Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[5, 0.3, 16, 100]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Inner Portal */}
      <mesh ref={portalRef}>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial
          color="#0a0a15"
          emissive="#d946ef"
          emissiveIntensity={0.3}
          metalness={1}
          roughness={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Portal Glow */}
      <pointLight color="#d946ef" intensity={5} distance={20} />
      <pointLight color="#00d4ff" intensity={3} distance={15} position={[0, 0, 1]} />
    </group>
  );
}

// Floating Platforms
function FloatingPlatform({ position, color, label }: { 
  position: [number, number, number]; 
  color: string;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position}>
        <mesh
          ref={meshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <cylinderGeometry args={[3, 3, 0.5, 32]} />
          <meshStandardMaterial
            color={hovered ? '#ffffff' : color}
            emissive={color}
            emissiveIntensity={hovered ? 1 : 0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Platform Label */}
        {hovered && (
          <Html center position={[0, 2, 0]}>
            <div className="px-4 py-2 bg-background/90 rounded-lg border border-primary/30 whitespace-nowrap">
              <p className="text-sm font-display text-primary">{label}</p>
            </div>
          </Html>
        )}

        {/* Platform Light */}
        <pointLight color={color} intensity={2} distance={10} position={[0, 1, 0]} />
      </group>
    </Float>
  );
}

// Avatar (simple representation)
function Avatar({ position, color }: { position: [number, number, number]; color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {/* Body */}
        <mesh position={[0, 0.8, 0]}>
          <capsuleGeometry args={[0.3, 0.8, 8, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.5}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        {/* Glow */}
        <pointLight color={color} intensity={1} distance={3} />
      </group>
    </Float>
  );
}

// Ambient Particles
function AmbientParticles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera Controller for WASD movement
function CameraController() {
  const { camera } = useThree();
  const keys = useRef<Set<string>>(new Set());
  const velocity = useRef(new THREE.Vector3());

  useFrame(() => {
    const speed = 0.15;
    const direction = new THREE.Vector3();

    if (keys.current.has('w') || keys.current.has('arrowup')) direction.z -= 1;
    if (keys.current.has('s') || keys.current.has('arrowdown')) direction.z += 1;
    if (keys.current.has('a') || keys.current.has('arrowleft')) direction.x -= 1;
    if (keys.current.has('d') || keys.current.has('arrowright')) direction.x += 1;

    direction.normalize();
    direction.applyQuaternion(camera.quaternion);
    direction.y = 0; // Keep movement horizontal

    velocity.current.lerp(direction.multiplyScalar(speed), 0.1);
    camera.position.add(velocity.current);
  });

  // Event listeners
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => keys.current.add(e.key.toLowerCase()));
    window.addEventListener('keyup', (e) => keys.current.delete(e.key.toLowerCase()));
  }

  return null;
}

// Main Scene
function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 5, 20]} fov={60} />
      <CameraController />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={50}
      />

      {/* Environment */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 20, 10]} intensity={0.5} color="#00d4ff" />
      
      {/* Stars */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* World Elements */}
      <WorldGrid />
      <CentralPortal />
      <AmbientParticles />

      {/* Floating Platforms */}
      <FloatingPlatform position={[-15, 2, -5]} color="#00d4ff" label="Hub Central" />
      <FloatingPlatform position={[15, 3, -8]} color="#d946ef" label="Marketplace" />
      <FloatingPlatform position={[-10, 4, -20]} color="#8b5cf6" label="DreamSpace" />
      <FloatingPlatform position={[12, 2.5, -18]} color="#22d3ee" label="Arena" />

      {/* Example Avatars (other users) */}
      <Avatar position={[-12, 1, -3]} color="#00d4ff" />
      <Avatar position={[10, 1, -5]} color="#d946ef" />
      <Avatar position={[-5, 1, -12]} color="#22d3ee" />

      {/* Fog */}
      <fog attach="fog" args={['#050510', 30, 100]} />
    </>
  );
}

export function VRWorld() {
  return (
    <div className="w-full h-full">
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
