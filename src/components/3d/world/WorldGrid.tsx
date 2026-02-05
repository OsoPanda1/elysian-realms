// world/WorldGrid.tsx
import { Grid } from '@react-three/drei';

export function WorldGrid() {
  return (
    <Grid
      position={[0, -0.5, 0]}
      args={[120, 120]}
      cellSize={2}
      cellThickness={0.5}
      cellColor="#00d4ff"
      sectionSize={10}
      sectionThickness={1}
      sectionColor="#d946ef"
      fadeDistance={70}
      fadeStrength={1}
      infiniteGrid
    />
  );
}
