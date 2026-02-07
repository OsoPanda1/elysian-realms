import { AffectiveVector } from "./affect.types";
import { CognitiveMood } from "./cognition.types";

export interface CognitiveState {
  mood: CognitiveMood;
  affect: AffectiveVector;

  risk: number;        // 0..1
  load: number;        // 0..1
  coherence: number;   // 0..1
  legitimacy: number;  // 0..1

  activeProtocols: string[];
  lastUpdate: number;
}
