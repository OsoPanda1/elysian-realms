import { Avatar } from './Avatar';

export function AvatarLayer() {
  return (
    <group>
      <Avatar id="player" position={[0, 0, 0]} color="#00d4ff" />
    </group>
  );
}
