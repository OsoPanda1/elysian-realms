// src/protocols/protocol.msr.adapter.ts
// ADAPTADOR PROTOCOLOS ↔ MSR · CADENA CIVILIZATORIA

import { MSREngine } from "@/msr/msr.engine";
import {
  MSRBlockPayload,
  MSRAppendResult,
  MSRDomain,
} from "@/msr/msr.types";
import {
  ProtocolContext,
  ProtocolTrigger,
  ProtocolId,
  ProtocolState,
} from "./protocol.types";

export interface ProtocolMSRRefs {
  triggerBlockIndex?: number;
  triggerBlockHash?: string;
  lastStateBlockIndex?: number;
  lastStateBlockHash?: string;
}

/**
 * Adaptador entre el motor de protocolos y la MSR.
 * - Cada trigger se ancla como evento soberano.
 * - Cada cambio de estado se ancla como transición auditable.
 * - Devuelve referencias MSR para cruzarlas con BookPI / Threat / EOCT.
 */
export class ProtocolToMSRAdapter {
  constructor(private readonly msr: MSREngine) {}

  /**
   * Registra un disparador de protocolo (antes o al mismo tiempo que armar).
   */
  recordTrigger(
    trigger: ProtocolTrigger,
  ): MSRAppendResult & { protocolId: ProtocolId } {
    const payload: MSRBlockPayload = {
      domain: this.mapDomain(trigger.protocolId),
      type: "protocol_trigger",
      data: {
        protocolId: trigger.protocolId,
        authority: trigger.authority,
        reason: trigger.reason,
        threatLevel: trigger.threatLevel,
        impactDomains: trigger.impactDomains,
        activationMode: trigger.activationMode,
        relatedThreatId: trigger.relatedThreatId ?? null,
        relatedMSRBlockIndex: trigger.relatedMSRBlockIndex ?? null,
        relatedAnchorId: trigger.relatedAnchorId ?? null,
        ts: trigger.ts,
      },
    };

    const result = this.msr.append(payload);

    return {
      ...result,
      protocolId: trigger.protocolId,
    };
  }

  /**
   * Registra un cambio de estado del protocolo (arming, active, contained, etc.).
   * Idealmente se llama cada vez que ProtocolEngine modifica el contexto.
   */
  recordState(
    context: ProtocolContext,
  ): MSRAppendResult & { protocolId: ProtocolId; protocolState: ProtocolState } {
    const payload: MSRBlockPayload = {
      domain: this.mapDomain(context.id),
      type: "protocol_state_change",
      data: {
        protocolId: context.id,
        episodeId: context.episodeId,
        state: context.state,
        irreversibility: context.irreversibility,
        authority: context.authority ?? null,
        activationMode: context.activationMode ?? null,
        reason: context.reason ?? null,
        approvals: context.approvals.map((a) => ({
          approverId: a.approverId,
          role: a.role,
          approvedAt: a.approvedAt,
          signatureRef: a.signatureRef ?? null,
        })),
        guardrails: context.guardrails,
        rtoMinutes: context.rtoMinutes ?? null,
        rpoMinutes: context.rpoMinutes ?? null,
        lastThreatLevel: context.lastThreatLevel ?? null,
        lastThreatId: context.lastThreatId ?? null,
        lastMSRBlockIndex: context.lastMSRBlockIndex ?? null,
        lastAnchorId: context.lastAnchorId ?? null,
        activatedAt: context.activatedAt ?? null,
        lastUpdate: context.lastUpdate,
      },
    };

    const result = this.msr.append(payload);

    return {
      ...result,
      protocolId: context.id,
      protocolState: context.state,
    };
  }

  /**
   * Registra explícitamente que un episodio de protocolo fue cerrado
   * (útil para auditar ciclos completos).
   */
  recordEpisodeTermination(context: ProtocolContext): MSRAppendResult {
    const payload: MSRBlockPayload = {
      domain: this.mapDomain(context.id),
      type: "protocol_episode_terminated",
      data: {
        protocolId: context.id,
        episodeId: context.episodeId,
        finalState: context.state,
        irreversibility: context.irreversibility,
        authority: context.authority ?? null,
        approvalsCount: context.approvals.length,
        lastThreatLevel: context.lastThreatLevel ?? null,
        lastThreatId: context.lastThreatId ?? null,
        rtoMinutes: context.rtoMinutes ?? null,
        rpoMinutes: context.rpoMinutes ?? null,
        terminatedAt: context.lastUpdate,
      },
    };

    return this.msr.append(payload);
  }

  /**
   * Determina el dominio MSR lógico para un protocolo.
   */
  private mapDomain(id: ProtocolId): MSRDomain {
    switch (id) {
      case "protocolo-hoyo-negro":
        return "guardianias";
      case "protocolo-fenix":
        return "governance";
      default:
        return "protocols" as MSRDomain;
    }
  }
}
