import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { PlazaMayor } from './PlazaMayor';
import { TemploMSR } from './TemploMSR';
import { SantuarioIsabella } from './SantuarioIsabella';
import { TianguisEconomico } from './TianguisEconomico';
import { MurallasGuardianes } from './MurallasGuardianes';

// District types - exported for use in other components
export type District = 'plaza' | 'templo' | 'santuario' | 'tianguis' | 'murallas';

// First Person Controls with WASD
function FirstPersonCamera({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    const speed = 30;
    direction.current.set(0, 0, 0);

    if (keys.current['KeyW'] || keys.current['ArrowUp']) direction.current.z = -1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) direction.current.z = 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) direction.current.x = -1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) direction.current.x = 1;

    direction.current.normalize();
    direction.current.applyQuaternion(camera.quaternion);
    direction.current.y = 0; // Keep on ground level

    velocity.current.lerp(direction.current.multiplyScalar(speed), 0.1);
    camera.position.add(velocity.current.clone().multiplyScalar(delta));

    // Keep camera at fixed height
    camera.position.y = 5;
  });

  return null;
}

// District Loader - Shows appropriate district based on current location
interface DistrictLoaderProps {
  currentDistrict: District;
}

function DistrictLoader({ currentDistrict }: DistrictLoaderProps) {
  return (
    <Suspense fallback={null}>
      {currentDistrict === 'plaza' && <PlazaMayor />}
      {currentDistrict === 'templo' && <TemploMSR />}
      {currentDistrict === 'santuario' && <SantuarioIsabella />}
      {currentDistrict === 'tianguis' && <TianguisEconomico />}
      {currentDistrict === 'murallas' && <MurallasGuardianes />}
    </Suspense>
  );
}

// City Skyline (visible from plaza)
function CitySkyline() {
  return (
    <group>
      {/* Distant pyramid-servers */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const distance = 150 + Math.random() * 50;
        const height = 30 + Math.random() * 40;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * distance,
              height / 2,
              Math.sin(angle) * distance
            ]}
          >
            <coneGeometry args={[15, height, 4]} />
            <meshStandardMaterial
              color="#1a1a2e"
              emissive="#00d4ff"
              emissiveIntensity={0.05}
            />
          </mesh>
        );
      })}
      
      {/* Distant towers */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 + 0.3;
        const distance = 180 + Math.random() * 30;
        const height = 40 + Math.random() * 30;
        
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * distance,
              height / 2,
              Math.sin(angle) * distance
            ]}
          >
            <cylinderGeometry args={[2, 3, height, 6]} />
            <meshStandardMaterial
              color="#0f0f1a"
              emissive="#ff00ff"
              emissiveIntensity={0.03}
            />
          </mesh>
        );
      })}
    </group>
  );
}

interface CiudadTAMVProps {
  initialDistrict?: District;
  onDistrictChange?: (district: District) => void;
  fpMode?: boolean;
}

export function CiudadTAMV({ 
  initialDistrict = 'plaza', 
  onDistrictChange,
  fpMode = false 
}: CiudadTAMVProps) {
  const [currentDistrict, setCurrentDistrict] = useState<District>(initialDistrict);

  const handleDistrictChange = (district: District) => {
    setCurrentDistrict(district);
    onDistrictChange?.(district);
  };

  return (
    <Canvas
      camera={{ position: [0, 5, 30], fov: 75 }}
      gl={{ antialias: true }}
      dpr={[1, 2]}
    >
      {/* Lighting */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[50, 100, 50]} intensity={0.3} color="#00d4ff" />
      <directionalLight position={[-50, 100, -50]} intensity={0.2} color="#ff00ff" />
      
      {/* Environment */}
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0} fade speed={0.5} />
      <fog attach="fog" args={['#050510', 50, 300]} />
      
      {/* Current District */}
      <DistrictLoader currentDistrict={currentDistrict} />
      
      {/* City Skyline (always visible) */}
      <CitySkyline />
      
      {/* Guardian Walls (always visible in background) */}
      <MurallasGuardianes />
      
      {/* Controls */}
      {fpMode ? (
        <>
          <PointerLockControls />
          <FirstPersonCamera enabled={true} />
        </>
      ) : (
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={200}
          maxPolarAngle={Math.PI / 2.1}
        />
      )}
    </Canvas>
  );
}

// District Navigation HUD
interface DistrictHUDProps {
  currentDistrict: District;
  onNavigate: (district: District) => void;
}

export function DistrictHUD({ currentDistrict, onNavigate }: DistrictHUDProps) {
  const districts: { id: District; name: string; icon: string; color: string }[] = [
    { id: 'plaza', name: 'Plaza Mayor', icon: '🏛️', color: '#00d4ff' },
    { id: 'templo', name: 'Templo MSR', icon: '📜', color: '#00d4ff' },
    { id: 'santuario', name: 'Santuario Isabella', icon: '✨', color: '#ff00ff' },
    { id: 'tianguis', name: 'Tianguis Económico', icon: '💰', color: '#d4af37' },
    { id: 'murallas', name: 'Murallas Guardianes', icon: '🛡️', color: '#ff0000' },
  ];

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-50">
      {districts.map((district) => (
        <button
          key={district.id}
          onClick={() => onNavigate(district.id)}
          className={`
            px-4 py-2 rounded-lg font-display text-sm transition-all duration-300
            ${currentDistrict === district.id 
              ? 'bg-primary text-primary-foreground glow-primary' 
              : 'glass hover:bg-primary/20'
            }
          `}
          style={{
            borderColor: currentDistrict === district.id ? district.color : 'transparent',
            borderWidth: '1px'
          }}
        >
          <span className="mr-2">{district.icon}</span>
          <span className="hidden md:inline">{district.name}</span>
        </button>
      ))}
    </div>
  );
}
