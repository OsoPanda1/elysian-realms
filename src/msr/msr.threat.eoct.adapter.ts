// src/msr/msr.threat.eoct.adapter.ts

import { MSRThreatContext, MSRThreatLevel } from "./msr.threat.types";

export type EOCTChannel = "console" | "webhook" | "pager" | "chat";

export interface EOCTNotificationResult {
  ok: boolean;
  channel: EOCTChannel;
  error?: string;
  notifiedAt: number;
}

/**
 * Firma minimal del EOCT real.
 * Implementaciones concretas (Slack, PagerDuty, panel XR, etc.)
 * viven en otra capa.
 */
export interface EOCTNotifier {
  notify(
    context: MSRThreatContext,
    channel: EOCTChannel,
  ): Promise<EOCTNotificationResult>;
}

/**
 * Políticas de escalamiento EOCT.
 */
export interface MSRThreatEOCTConfig {
  minIntervalMs: number;          // anti‑spam
  highLevelChannels: EOCTChannel[];       // para "high"
  existentialLevelChannels: EOCTChannel[]; // para "existential"
  alwaysNotifyOnExistential: boolean;
  logFailedAttempts: boolean;
}

const DEFAULT_CONFIG: MSRThreatEOCTConfig = {
  minIntervalMs: 60_000,
  highLevelChannels: ["webhook"],
  existentialLevelChannels: ["pager", "webhook"],
  alwaysNotifyOnExistential: true,
  logFailedAttempts: true,
};

/**
 * Adaptador EOCT: convierte un MSRThreatContext en una
 * llamada disciplinada al centro de operaciones.
 */
export class MSRThreatEOCTAdapter {
  private lastNotificationTs: number | null = null;
  private lastNotificationLevel: MSRThreatLevel | null = null;
  private readonly config: MSRThreatEOCTConfig;

  constructor(
    private readonly eoct: EOCTNotifier,
    config?: Partial<MSRThreatEOCTConfig>,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Intenta escalar según contexto y políticas.
   * Devuelve el resultado del último canal probado o null si no se notificó.
   */
  async escalate(
    context: MSRThreatContext,
  ): Promise<EOCTNotificationResult | null> {
    if (!context.escalationRequired && !this.shouldForceByLevel(context)) {
      return null;
    }

    const now = Date.now();

    // Anti‑spam / deduplicación básica
    if (
      this.lastNotificationTs &&
      now - this.lastNotificationTs < this.config.minIntervalMs &&
      this.lastNotificationLevel === context.currentLevel
    ) {
      return null;
    }

    const channels = this.chooseChannels(context.currentLevel);
    let lastResult: EOCTNotificationResult | null = null;

    for (const ch of channels) {
      try {
        const res = await this.eoct.notify(context, ch);
        lastResult = res;

        if (res.ok) {
          this.lastNotificationTs = res.notifiedAt;
          this.lastNotificationLevel = context.currentLevel;
          context.eoctNotified = true;
          break; // con un canal exitoso basta
        }
      } catch (err) {
        if (!this.config.logFailedAttempts) continue;
        // Aquí podrías anclar en BookPI/MSR con otro adaptador
        // por ahora sólo seguimos al siguiente canal
        lastResult = {
          ok: false,
          channel: ch,
          error: err instanceof Error ? err.message : "unknown",
          notifiedAt: Date.now(),
        };
      }
    }

    return lastResult;
  }

  private chooseChannels(level: MSRThreatLevel): EOCTChannel[] {
    if (level === "existential") {
      return this.config.existentialLevelChannels;
    }
    if (level === "high") {
      return this.config.highLevelChannels;
    }
    // Para niveles menores podrías usar sólo consola / logs
    return ["console"];
  }

  private shouldForceByLevel(ctx: MSRThreatContext): boolean {
    return (
      this.config.alwaysNotifyOnExistential &&
      ctx.currentLevel === "existential"
    );
  }
}
