import { Stars } from '@react-three/drei';

export function WorldEnvironment() {
  return (
    <>
      <Stars
        radius={200}
        depth={80}
        count={6000}
        factor={5}
        fade
        speed={0.3}
      />
    </>
  );
}
