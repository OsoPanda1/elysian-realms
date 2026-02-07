// src/msr/msr.threat.bookpi.adapter.ts

import { BookPI } from "@/core/bookpi";
import { MSRThreatSignal, MSRThreatContext } from "./msr.threat.types";

type BookPILevel = "low" | "normal" | "high" | "critical";

function mapThreatToBookPILevel(level: MSRThreatSignal["level"]): BookPILevel {
  switch (level) {
    case "existential":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "normal";
    case "low":
      return "low";
    case "none":
    default:
      return "low";
  }
}

export class MSRThreatToBookPIAdapter {
  constructor(private readonly bookpi: BookPI) {}

  /**
   * Ancla una señal de amenaza individual en BookPI.
   * Útil para trazabilidad detallada (nivel evento).
   */
  anchorSignal(signal: MSRThreatSignal) {
    const level = mapThreatToBookPILevel(signal.level);

    this.bookpi.anchorEvent({
      domain: "threat",
      type: "threat_signal",
      level,
      data: {
        id: signal.id,
        level: signal.level,
        domain: signal.domain,
        source: signal.source,
        description: signal.description,
        detectedBy: signal.detectedBy,
        tags: signal.tags ?? [],
        relatedBlockIndex: signal.relatedBlockIndex ?? null,
        relatedAnchorId: signal.relatedAnchorId ?? null,
        ts: signal.ts,
      },
      candidateForLedger: level === "high" || level === "critical",
    });
  }

  /**
   * Ancla un snapshot agregado del contexto de amenaza (episodio).
   * Útil cuando el motor de amenaza considera que el estado global
   * del sistema debe quedar registrado como hito civilizatorio.
   */
  anchorContext(context: MSRThreatContext) {
    const level = mapThreatToBookPILevel(context.currentLevel);

    this.bookpi.anchorEvent({
      domain: "threat",
      type: "threat_context_snapshot",
      level,
      data: {
        currentLevel: context.currentLevel,
        highestLevelSeen: context.highestLevelSeen,
        lastUpdate: context.lastUpdate,
        phase: context.phase,
        suggestedProtocol: context.suggestedProtocol ?? "none",
        escalationRequired: context.escalationRequired,
        eoctNotified: context.eoctNotified,
        matrix: context.matrix,
        metrics: context.metrics,
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
        anchoredInMSR: context.anchoredInMSR ?? false,
        anchoredInBookPI: context.anchoredInBookPI ?? false,
      },
      candidateForLedger: level === "high" || level === "critical",
    });
  }

  /**
   * Atajo: registra tanto la señal individual como el contexto agregado
   * en una sola llamada, pensado para incidentes importantes.
   */
  anchorSignalAndContext(
    signal: MSRThreatSignal,
    context: MSRThreatContext,
  ) {
    this.anchorSignal(signal);
    this.anchorContext(context);
  }
}
