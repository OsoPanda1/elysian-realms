// src/msr/msr.threat.types.ts

export type MSRThreatLevel =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "existential";

export const MSR_THREAT_LEVEL_WEIGHT: Record<MSRThreatLevel, number> = {
  none: 0,
  low: 1,
  medium: 2,
  high: 3,
  existential: 4,
};

export type MSRThreatDomain =
  | "security"
  | "infrastructure"
  | "economy"
  | "identity"
  | "governance"
  | "xr"
  | "unknown";

export type MSRThreatSource =
  | "guardiania"
  | "radar"
  | "eoct"
  | "system"
  | "external";

export interface MSRThreatSignal {
  id: string;
  level: MSRThreatLevel;
  domain: MSRThreatDomain;
  source: MSRThreatSource;

  description?: string;
  detectedBy?: string;        // id de guardianía / radar / EOCT

  relatedBlockIndex?: number; // índice en MSR
  relatedAnchorId?: string;   // id BookPI

  ts: number;
  tags?: string[];            // ej. ["ddos","xr-latency"]

  // severidad numérica continua 0..1 para cálculos finos
  severityScore?: number;
}

/** Estado agregado multidimensional */
export interface MSRThreatMatrix {
  byDomain: Record<MSRThreatDomain, MSRThreatLevel>;
  bySource: Record<MSRThreatSource, number>; // conteo ponderado o score acumulado
}

/** Métricas temporales */
export interface MSRThreatMetrics {
  totalSignals: number;
  byLevel: Record<MSRThreatLevel, number>;
  last24hSignals: number;
  last1hSignals: number;

  // Extras útiles
  lastHighOrAboveTs?: number;
  lastExistentialTs?: number;
}

/** Fases del ciclo de vida de una amenaza global */
export type MSRThreatPhase =
  | "stable"
  | "degrading"
  | "critical"
  | "recovery";

/** Contexto soberano */
export interface MSRThreatContext {
  currentLevel: MSRThreatLevel;
  highestLevelSeen: MSRThreatLevel;

  lastUpdate: number;
  lastSignal?: MSRThreatSignal;

  matrix: MSRThreatMatrix;
  metrics: MSRThreatMetrics;

  phase: MSRThreatPhase;

  suggestedProtocol?:
    | "none"
    | "protocolo-hoyo-negro"
    | "protocolo-fenix";

  escalationRequired: boolean;
  eoctNotified: boolean;

  // marca si ya se generó un bloque MSR y/o anchor BookPI por este episodio
  anchoredInMSR?: boolean;
  anchoredInBookPI?: boolean;
}
