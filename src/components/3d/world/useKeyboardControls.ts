// world/useKeyboardControls.ts
import { useEffect, useRef } from 'react';

export type KeyState = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

const KEY_MAP: Record<string, keyof KeyState> = {
  w: 'forward',
  arrowup: 'forward',
  s: 'backward',
  arrowdown: 'backward',
  a: 'left',
  arrowleft: 'left',
  d: 'right',
  arrowright: 'right',
};

export function useKeyboardControls() {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });

  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key.toLowerCase()];
      if (!key) return;
      keys.current[key] = true;
    };

    const handleUp = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key.toLowerCase()];
      if (!key) return;
      keys.current[key] = false;
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);

    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return keys;
}
