// world/useWorldRouter.ts
import { create } from 'zustand';

export type WorldScene = 'hub' | 'marketplace' | 'dreamspace' | 'arena';

type WorldRouterState = {
  scene: WorldScene;
  setScene: (scene: WorldScene) => void;
};

export const useWorldRouter = create<WorldRouterState>((set) => ({
  scene: 'hub',
  setScene: (scene) => set({ scene }),
}));
