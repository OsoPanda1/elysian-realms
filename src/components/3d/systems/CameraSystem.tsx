import { OrbitControls } from '@react-three/drei';

interface CameraSystemProps {
  mode?: 'exploration' | 'cinematic' | 'fixed';
}

export function CameraSystem({ mode = 'exploration' }: CameraSystemProps) {
  return (
    <OrbitControls
      enablePan={mode === 'exploration'}
      enableZoom={mode !== 'fixed'}
      enableRotate
      maxDistance={100}
      minDistance={2}
      autoRotate={mode === 'cinematic'}
      autoRotateSpeed={0.3}
    />
  );
}
