import { FloatingPlatform } from './FloatingPlatform';
import { CentralPortal } from './CentralPortal';
import { WorldGrid } from './WorldGrid';

export function CivilizationalLayer() {
  return (
    <group>
      <WorldGrid />
      <CentralPortal />
      <FloatingPlatform id="plaza" position={[-8, 2, -5]} color="#00d4ff" label="Plaza Mayor" />
      <FloatingPlatform id="templo" position={[8, 3, -8]} color="#d946ef" label="Templo MSR" />
      <FloatingPlatform id="tianguis" position={[0, 1.5, 10]} color="#f59e0b" label="Tianguis" />
    </group>
  );
}
