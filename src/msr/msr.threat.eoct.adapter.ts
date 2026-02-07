// src/msr/msr.threat.eoct.adapter.ts

import { MSRThreatContext } from "./msr.threat.types";

export type EOCTChannel = "console" | "webhook" | "pager" | "chat";

export interface EOCTNotificationResult {
  ok: boolean;
  channel: EOCTChannel;
  error?: string;
}

export interface EOCTNotifier {
  notify(
    context: MSRThreatContext,
  ): Promise<EOCTNotificationResult>;
}

/**
 * Configuración de políticas de escalamiento EOCT
 */
export interface MSRThreatEOCTConfig {
  minIntervalMs: number;          // anti‑spam entre notificaciones
  requireExistentialForPager: boolean;
}

const DEFAULT_CONFIG: MSRThreatEOCTConfig = {
  minIntervalMs: 60_000,          // mínimo 60s entre avisos
  requireExistentialForPager: true,
};

/**
 * Adaptador EOCT:
 * - Decide CUÁNDO escalar.
 * - Asegura que no se sature EOCT.
 * - Marca acknowledgements y fases del incidente.
 */
export class MSRThreatEOCTAdapter {
  private lastNotificationTs: number | null = null;
  private readonly config: MSRThreatEOCTConfig;

  constructor(
    private readonly eoct: EOCTNotifier,
    config?: Partial<MSRThreatEOCTConfig>,
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Intenta escalar al EOCT según el contexto.
   * No hace nada si no hace falta escalar o si se violan ventanas anti‑spam.
   */
  async escalate(context: MSRThreatContext): Promise<EOCTNotificationResult | null> {
    if (!context.escalationRequired) {
      return null;
    }

    const now = Date.now();
    if (
      this.lastNotificationTs &&
      now - this.lastNotificationTs < this.config.minIntervalMs
    ) {
      // Anti‑spam: ya se notificó hace muy poco
      return null;
    }

    // Elegir canal lógico según severidad
    const channel: EOCTChannel =
      context.currentLevel === "existential" ||
      (context.currentLevel === "high" &&
        !this.config.requireExistentialForPager)
        ? "pager"
        : "webhook";

    const result = await this.eoct.notify(context);

    if (result.ok) {
      this.lastNotificationTs = now;
      context.eoctNotified = true;
    }

    return { ...result, channel };
  }
}
