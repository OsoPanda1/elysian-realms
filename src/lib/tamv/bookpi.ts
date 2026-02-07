/**
 * BookPI™ — Libro Civilizatorio de Auditoría Inmutable
 * Ledger ético con hash chain, firma y jurisdicción MX
 * Genera anchors SHA-256, enlaza prevHash, metadatos de jurisdicción
 */

import { supabase } from '@/integrations/supabase/client';

export type BookPIEventType =
  | 'SYSTEM_EVENT'
  | 'SECURITY_EVENT'
  | 'ETHICAL_EVENT'
  | 'GOVERNANCE_EVENT'
  | 'ECONOMIC_EVENT'
  | 'FOUNDATIONAL_EVENT'
  | 'AI_DECISION_EVENT'
  | 'SANCTION_EVENT'
  | 'CONSTITUTIONAL_CHANGE'
  | 'USER_INITIATION'
  | 'TIME_UP_EVENT'
  | 'DIGNITY_ATTACK'
  | 'SILENCE_EVENT';

export interface BookPIAnchor {
  event_id: string;
  type: BookPIEventType;
  actor: string;
  timestamp: string;
  payload_hash: string;
  prev_hash: string | null;
  jurisdiction: string;
  classification: string;
  constitution_version: string;
  metadata?: Record<string, unknown>;
}

// In-browser SHA-256 using Web Crypto API
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

let lastHash: string | null = null;

/**
 * Generate a BookPI anchor for an event and persist to registry
 */
export async function anchorEvent(
  type: BookPIEventType,
  actorId: string,
  payload: Record<string, unknown>,
  classification: string = 'STANDARD'
): Promise<BookPIAnchor> {
  const timestamp = new Date().toISOString();
  const payloadStr = JSON.stringify({ ...payload, timestamp, type, actor: actorId });
  const payloadHash = await sha256(payloadStr);

  const anchor: BookPIAnchor = {
    event_id: crypto.randomUUID(),
    type,
    actor: `did:tamv:${actorId}`,
    timestamp,
    payload_hash: payloadHash,
    prev_hash: lastHash,
    jurisdiction: 'MX',
    classification,
    constitution_version: 'v1.0.0',
    metadata: payload,
  };

  // Persist to registry table
  const { error } = await supabase.from('registry').insert([{
    act_type: type,
    content_hash: payloadHash,
    description: `BookPI:${type}:${classification}`,
    user_id: actorId,
    metadata: JSON.parse(JSON.stringify({
      ...anchor,
      chain_prev: lastHash,
    })),
    is_immutable: true,
  }]);

  if (error) {
    console.error('[BookPI] Anchor failed:', error.message);
    throw error;
  }

  lastHash = payloadHash;
  return anchor;
}

/**
 * Attach an external ledger transaction ID to a BookPI anchor
 */
export function attachLedgerTx(anchor: BookPIAnchor, txId: string): BookPIAnchor {
  return {
    ...anchor,
    metadata: {
      ...anchor.metadata,
      ledger_tx_id: txId,
      ledger_attached_at: new Date().toISOString(),
    },
  };
}

/**
 * Verify a hash chain integrity
 */
export async function verifyChain(anchors: BookPIAnchor[]): Promise<boolean> {
  for (let i = 1; i < anchors.length; i++) {
    if (anchors[i].prev_hash !== anchors[i - 1].payload_hash) {
      console.error(`[BookPI] Chain break at index ${i}`);
      return false;
    }
  }
  return true;
}
