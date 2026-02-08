/**
 * MSR Engine — Cadena inmutable de eventos civilizatorios.
 * Ledger in-memory con hash-chain para auditoría soberana.
 */

import {
  MSRBlock,
  MSRBlockPayload,
  MSRChainState,
  MSRAppendResult,
  MSRDomain,
} from "./msr.types";

export class MSREngine {
  private chain: MSRBlock[] = [];
  private lastHash: string | null = null;

  constructor() {
    // Genesis state
  }

  append(payload: MSRBlockPayload): MSRAppendResult {
    const ts = Date.now();
    const index = this.chain.length;
    const hash = this.computeHash(payload, index, ts);

    const block: MSRBlock = {
      index,
      hash,
      prevHash: this.lastHash,
      domain: payload.domain,
      type: payload.type,
      data: payload.data,
      ts,
    };

    this.chain.push(block);
    this.lastHash = hash;

    const state = this.getState();

    return { block, state, index, hash };
  }

  getState(): MSRChainState {
    return {
      length: this.chain.length,
      lastHash: this.lastHash,
      lastIndex: Math.max(0, this.chain.length - 1),
      createdAt: this.chain[0]?.ts ?? Date.now(),
      lastUpdate: this.chain[this.chain.length - 1]?.ts ?? Date.now(),
    };
  }

  getBlock(index: number): MSRBlock | undefined {
    return this.chain[index];
  }

  getChain(limit?: number): MSRBlock[] {
    if (limit) return this.chain.slice(-limit);
    return [...this.chain];
  }

  verifyIntegrity(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      if (this.chain[i].prevHash !== this.chain[i - 1].hash) {
        return false;
      }
    }
    return true;
  }

  private computeHash(payload: MSRBlockPayload, index: number, ts: number): string {
    const raw = JSON.stringify({ ...payload, index, ts, prevHash: this.lastHash });
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash + raw.charCodeAt(i)) | 0;
    }
    return `msr_${index}_${Math.abs(hash).toString(16).padStart(12, '0')}`;
  }
}
