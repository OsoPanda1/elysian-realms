/**
 * MSR (Meta-System Registry) — Tipos del ledger inmutable.
 */

export type MSRDomain =
  | "identity"
  | "cognition"
  | "governance"
  | "economy"
  | "guardianias"
  | "protocols"
  | "security"
  | "xr";

export interface MSRBlockPayload {
  domain: MSRDomain;
  type: string;
  data: Record<string, unknown>;
}

export interface MSRBlock {
  index: number;
  hash: string;
  prevHash: string | null;
  domain: MSRDomain;
  type: string;
  data: Record<string, unknown>;
  ts: number;
}

export interface MSRChainState {
  length: number;
  lastHash: string | null;
  lastIndex: number;
  createdAt: number;
  lastUpdate: number;
}

export interface MSRAppendResult {
  block: MSRBlock;
  state: MSRChainState;
  index: number;
  hash: string;
}
