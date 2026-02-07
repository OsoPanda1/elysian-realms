// src/msr/msr.threat.adapter.ts

import { MSREngine } from "./msr.engine";
import {
  MSRDomain,
  MSRBlockPayload,
  MSRAppendResult,
} from "./msr.types";
import { MSRThreatSignal, MSRThreatContext } from "./msr.threat.types";

/**
 * MSRThreatToMSRAdapter
 * - Puente entre el subsistema de amenaza (guardianías, radares, EOCT)
 *   y la cadena MSR.
 * - Registra señales individuales y estados agregados (“episodios”).
 */
export class MSRThreatToMSRAdapter {
  constructor(private readonly msr: MSREngine) {}

  /**
   * Registra una señal de amenaza en MSR como bloque formal.
   * Devuelve bloque y señal enriquecida con índice/hash MSR.
   */
  recordThreat(signal: MSRThreatSignal): {
    block: MSRAppendResult["block"];
    state: MSRAppendResult["state"];
    enrichedSignal: MSRThreatSignal;
  } {
    const payload: MSRBlockPayload = {
      domain: this.mapDomain(signal),
      type: "threat_signal",
      data: {
        id: signal.id,
        level: signal.level,
        domain: signal.domain,
        source: signal.source,
        description: signal.description,
        detectedBy: signal.detectedBy,
        tags: signal.tags ?? [],
        ts: signal.ts,
      },
    };

    const result = this.msr.append(payload);

    const enrichedSignal: MSRThreatSignal = {
      ...signal,
      relatedBlockIndex: result.block.index,
    };

    return {
      block: result.block,
      state: result.state,
      enrichedSignal,
    };
  }

  /**
   * Registra un snapshot agregado del contexto de amenaza (episodio).
   * Útil cuando el motor de amenaza decide que el nivel global o la fase
   * ameritan quedar anclados explícitamente.
   */
  recordThreatEpisode(context: MSRThreatContext): MSRAppendResult {
    const payload: MSRBlockPayload = {
      domain: "governance",
      type: "threat_episode_snapshot",
      data: {
        currentLevel: context.currentLevel,
        highestLevelSeen: context.highestLevelSeen,
        phase: context.phase,
        suggestedProtocol: context.suggestedProtocol,
        escalationRequired: context.escalationRequired,
        eoctNotified: context.eoctNotified,
        metrics: context.metrics,
        matrix: context.matrix,
        lastSignal: context.lastSignal
          ? {
              id: context.lastSignal.id,
              level: context.lastSignal.level,
              domain: context.lastSignal.domain,
              source: context.lastSignal.source,
              ts: context.lastSignal.ts,
              tags: context.lastSignal.tags ?? [],
            }
          : null,
        ts: context.lastUpdate,
      },
    };

    return this.msr.append(payload);
  }

  /**
   * Registra explícitamente que un episodio fue anclado
   * en MSR/BookPI, para cerrar el ciclo de cadena de custodia.
   */
  recordAnchoringEvent(options: {
    msrHash: string;
    msrIndex: number;
    bookpiAnchorId?: string;
  }): MSRAppendResult {
    const payload: MSRBlockPayload = {
      domain: "governance",
      type: "threat_anchoring_completed",
      data: {
        msrIndex: options.msrIndex,
        msrHash: options.msrHash,
        bookpiAnchorId: options.bookpiAnchorId ?? null,
        ts: Date.now(),
      },
    };

    return this.msr.append(payload);
  }

  private mapDomain(signal: MSRThreatSignal): MSRDomain {
    if (signal.source === "guardiania" || signal.source === "radar") {
      return "guardianias";
    }
    if (signal.domain === "security" || signal.domain === "identity") {
      return "identity";
    }
    if (signal.domain === "economy") {
      return "economy";
    }
    if (signal.domain === "governance") {
      return "governance";
    }
    if (signal.domain === "xr") {
      return "cognition";
    }
    return "guardianias";
  }
}
