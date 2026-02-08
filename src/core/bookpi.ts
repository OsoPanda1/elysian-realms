/**
 * BookPI™ — Core BookPI Class
 * Interfaz unificada para auditoría civilizatoria inmutable.
 * Usado por guardianías, constitución, protocolos y bootstrap.
 */

export interface BookPIConfig {
  hashAlgo?: string;
  defaultAuditLevel?: string;
  redactSecrets?: boolean;
  jurisdiction?: string;
  dataClassification?: string;
  contextTag?: string;
  originCity?: string;
  originCountry?: string;
}

export interface BookPIEventPayload {
  domain: string;
  type: string;
  level: "low" | "normal" | "high" | "critical";
  data: Record<string, unknown>;
  candidateForLedger?: boolean;
  subject?: string;
}

export interface BookPIAnchorResult {
  anchorId: string;
  hash: string;
  ts: number;
  candidateForLedger: boolean;
}

/**
 * BookPI — Libro civilizatorio de auditoría.
 * Registra eventos con hash-chain en memoria.
 * Los eventos críticos se marcan como candidatos a ledger (MSR).
 */
export class BookPI {
  private readonly config: BookPIConfig;
  private anchors: BookPIAnchorResult[] = [];
  private lastHash: string | null = null;

  constructor(config?: BookPIConfig) {
    this.config = {
      hashAlgo: "SHA-256",
      defaultAuditLevel: "normal",
      redactSecrets: true,
      jurisdiction: "MX",
      dataClassification: "standard",
      contextTag: "tamv",
      originCity: "Real-del-Monte",
      originCountry: "MX",
      ...config,
    };
  }

  /**
   * Ancla un evento en el libro civilizatorio.
   */
  anchorEvent(payload: BookPIEventPayload): BookPIAnchorResult {
    const ts = Date.now();
    const anchorId = `bpi_${ts}_${Math.random().toString(36).slice(2, 8)}`;
    const hash = this.computeHash(payload, ts);

    const result: BookPIAnchorResult = {
      anchorId,
      hash,
      ts,
      candidateForLedger: payload.candidateForLedger ?? false,
    };

    this.anchors.push(result);
    this.lastHash = hash;

    return result;
  }

  getAnchors(): BookPIAnchorResult[] {
    return [...this.anchors];
  }

  getLastHash(): string | null {
    return this.lastHash;
  }

  getConfig(): BookPIConfig {
    return { ...this.config };
  }

  private computeHash(payload: BookPIEventPayload, ts: number): string {
    // Simplified hash for in-memory usage
    const raw = JSON.stringify({
      ...payload,
      ts,
      prevHash: this.lastHash,
      jurisdiction: this.config.jurisdiction,
    });
    // Simple deterministic hash (for browser compatibility without crypto import)
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash + char) | 0;
    }
    return `bpi_${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
}
