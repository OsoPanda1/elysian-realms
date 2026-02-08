export function WorldLighting() {
  return (
    <>
      <ambientLight intensity={0.15} color="#4a90d9" />
      <directionalLight
        position={[20, 40, 20]}
        intensity={0.6}
        color="#ffeedd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 15, 0]} intensity={0.8} color="#00d4ff" distance={50} />
      <pointLight position={[-20, 5, -20]} intensity={0.3} color="#d946ef" distance={40} />
    </>
  );
}
