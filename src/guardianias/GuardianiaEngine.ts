// src/guardianias/guardianias.engine.ts

import { CognitiveState } from "@/cognition/cognition.types";
import { BookPI, BookPIEventPayload } from "@/core/bookpi";

export type GuardianiaStatus = "idle" | "watching" | "alert" | "escalated";

export interface GuardianiasConfig {
  id: string;
  name: string;
  riskAlertThreshold: number;      // ej. 0.6
  riskEscalateThreshold: number;   // ej. 0.85
  minDurationMsForEscalation: number; // tiempo mínimo en alto riesgo
}

const DEFAULT_CONFIG: GuardianiasConfig = {
  id: "guardiania-principal",
  name: "Guardianía Principal TAMV",
  riskAlertThreshold: 0.6,
  riskEscalateThreshold: 0.85,
  minDurationMsForEscalation: 20_000, // 20s
};

export interface GuardianiaSnapshot {
  id: string;
  name: string;
  status: GuardianiaStatus;
  lastChange: number;
  lastStateSample?: {
    mood: string;
    perceivedRisk: number;
    activeProtocols: string[];
  };
}

export class GuardianiasEngine {
  private readonly config: GuardianiasConfig;
  private status: GuardianiaStatus = "watching";
  private lastChange = Date.now();

  // ventana de riesgo alto continuo
  private highRiskSince: number | null = null;

  constructor(private readonly bookpi: BookPI, config?: Partial<GuardianiasConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  evaluate(state: CognitiveState): GuardianiaSnapshot {
    const now = Date.now();
    const { perceivedRisk, mood, activeProtocols } = state;

    // Track de cuánto tiempo llevamos en alto riesgo
    if (perceivedRisk >= this.config.riskEscalateThreshold) {
      if (this.highRiskSince == null) this.highRiskSince = now;
    } else {
      this.highRiskSince = null;
    }

    let newStatus: GuardianiaStatus = this.status;

    if (
      perceivedRisk >= this.config.riskEscalateThreshold ||
      mood === "chaotic"
    ) {
      const duration =
        this.highRiskSince != null ? now - this.highRiskSince : 0;
      if (duration >= this.config.minDurationMsForEscalation || mood === "chaotic") {
        newStatus = "escalated";
      } else {
        newStatus = "alert";
      }
    } else if (perceivedRisk >= this.config.riskAlertThreshold || mood === "protective") {
      newStatus = "alert";
    } else {
      newStatus = "watching";
    }

    if (newStatus !== this.status) {
      const previous = this.status;
      this.status = newStatus;
      this.lastChange = now;

      this.anchorGuardianiaEvent("guardiania_status_changed", "high", {
        guardianiaId: this.config.id,
        name: this.config.name,
        previousStatus: previous,
        newStatus,
        mood,
        perceivedRisk,
        activeProtocols,
      });
    }

    if (this.status === "escalated") {
      this.anchorGuardianiaEvent("guardiania_escalation_required", "critical", {
        guardianiaId: this.config.id,
        name: this.config.name,
        mood,
        perceivedRisk,
        activeProtocols,
      });
    }

    return {
      id: this.config.id,
      name: this.config.name,
      status: this.status,
      lastChange: this.lastChange,
      lastStateSample: {
        mood,
        perceivedRisk,
        activeProtocols,
      },
    };
  }

  private anchorGuardianiaEvent(
    type: string,
    level: "low" | "normal" | "high" | "critical",
    data: Record<string, unknown>,
  ) {
    const payload: BookPIEventPayload = {
      domain: "guardianias",
      type,
      level,
      data,
      candidateForLedger: level === "critical",
    };
    this.bookpi.anchorEvent(payload);
  }
}
