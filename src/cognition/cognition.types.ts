/**
 * Tipos cognitivos centrales de TAMV.
 * Usados por el motor cognitivo, guardianías, constitución y protocolos.
 */

export type CognitiveMood =
  | "calm"
  | "alert"
  | "protective"
  | "chaotic"
  | "reflective";

export interface CognitiveState {
  mood: CognitiveMood;
  perceivedRisk: number; // 0..1
  activeProtocols: string[];
  lastUpdate: number;
  context?: Record<string, unknown>;
}

export interface CognitiveDecision {
  action: string;
  urgency: number; // 0..1
  scope: "local" | "global" | "eoct";
  target?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface CognitiveIntent {
  id: string;
  action: string;
  urgency: number;
  scope: "local" | "global" | "eoct";
  target?: string;
  reason?: string;
}
