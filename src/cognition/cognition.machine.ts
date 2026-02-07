// src/guardianias/guardianias.engine.ts

import {
  GuardianiaContext,
  ManualProtocolTrigger,
} from "./guardianias.types";
import { CognitiveState } from "@/cognition/cognition.types";
import { BookPI, BookPIEventPayload } from "@/core/bookpi";

export class GuardianiasEngine {
  private context: GuardianiaContext;
  private readonly bookpi?: BookPI;

  constructor(bookpi?: BookPI) {
    this.context = {
      id: "guardiania-principal",
      name: "Guardianía Principal TAMV",
      status: "watching",
      lastCheck: Date.now(),
    };
    this.bookpi = bookpi;
  }

  /** Evalúa el estado cognitivo y decide si se debe escalar algo a EOCT. */
  public evaluateState(state: CognitiveState): GuardianiaContext {
    const now = Date.now();
    this.context.lastCheck = now;

    if (state.perceivedRisk > 0.8 || state.mood === "chaotic") {
      this.context.status = "escalated";
      this.context.notes =
        "Riesgo percibido muy alto o estado caótico; se recomienda intervención EOCT.";
      this.anchorGuardianiaEvent("state_escalated", state);
    } else if (state.perceivedRisk > 0.4 || state.mood === "protective") {
      this.context.status = "alert";
      this.context.notes = "Sistema en modo alerta/protector.";
    } else {
      this.context.status = "watching";
      this.context.notes = "Monitoreo normal.";
    }

    return this.context;
  }

  /** Permite a un operador humano activar manualmente un protocolo. */
  public triggerManualProtocol(
    trigger: ManualProtocolTrigger,
  ): { accepted: boolean; reason?: string } {
    const criticalProtocols = [
      "protocolo-hoyo-negro",
      "protocolo-fenix",
    ];

    if (criticalProtocols.includes(trigger.protocolId)) {
      // Aquí podrías exigir 2FA, firma EOCT, etc.
      // Por ahora aceptamos pero lo marcamos como crítico en BookPI.
      this.anchorManualProtocol(trigger, "critical");
      return { accepted: true };
    }

    this.anchorManualProtocol(trigger, "normal");
    return { accepted: true };
  }

  private anchorGuardianiaEvent(
    type: string,
    state: CognitiveState,
  ) {
    if (!this.bookpi) return;

    const payload: BookPIEventPayload = {
      domain: "guardianias",
      type,
      level: "high",
      data: {
        guardianiaId: this.context.id,
        status: this.context.status,
        mood: state.mood,
        perceivedRisk: state.perceivedRisk,
        activeProtocols: state.activeProtocols,
      },
      candidateForLedger: true,
    };

    this.bookpi.anchorEvent(payload);
  }

  private anchorManualProtocol(
    trigger: ManualProtocolTrigger,
    criticality: "normal" | "critical",
  ) {
    if (!this.bookpi) return;

    const payload: BookPIEventPayload = {
      domain: "protocols",
      type: "manual_trigger",
      subject: trigger.targetId,
      level: criticality === "critical" ? "critical" : "high",
      data: {
        triggerId: trigger.id,
        protocolId: trigger.protocolId,
        reason: trigger.reason,
        requestedBy: trigger.requestedBy,
        scope: trigger.scope,
        createdAt: trigger.createdAt,
      },
      candidateForLedger: criticality === "critical",
    };

    this.bookpi.anchorEvent(payload);
  }
}
