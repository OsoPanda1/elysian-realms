/**
 * MSR™ — Meta-System Registry / Blockchain Bridge TAMV
 * Ledger institucional de eventos irreversibles
 * Prepara payloads para anclaje en ledger externo
 */

import { hash256 } from './dekateotl';
import { anchorEvent, type BookPIEventType } from './bookpi';

export interface MSREntry {
  id: string;
  type: BookPIEventType;
  actor_did: string;
  timestamp: string;
  payload_hash: string;
  chain_hash: string;
  signature: string | null;
  ledger_ready: boolean;
  ledger_tx_id: string | null;
}

let chainHead: string = '0x0000_GENESIS_TAMV';

/**
 * Create an MSR entry with chain linking
 */
export async function createMSREntry(
  type: BookPIEventType,
  actorId: string,
  payload: Record<string, unknown>
): Promise<MSREntry> {
  const timestamp = new Date().toISOString();
  const payloadHash = await hash256(JSON.stringify(payload));
  const chainHash = await hash256(`${chainHead}:${payloadHash}:${timestamp}`);

  const entry: MSREntry = {
    id: crypto.randomUUID(),
    type,
    actor_did: `did:tamv:${actorId}`,
    timestamp,
    payload_hash: payloadHash,
    chain_hash: chainHash,
    signature: null,
    ledger_ready: true,
    ledger_tx_id: null,
  };

  chainHead = chainHash;

  // Also anchor in BookPI
  try {
    await anchorEvent(type, actorId, {
      ...payload,
      msr_entry_id: entry.id,
      msr_chain_hash: chainHash,
    }, 'MSR_ANCHORED');
  } catch (e) {
    console.error('[MSR] BookPI anchor failed:', e);
  }

  return entry;
}

/**
 * Prepare payload for external blockchain submission
 */
export async function prepareLedgerPayload(entry: MSREntry): Promise<{
  contract_call: string;
  args: Record<string, string>;
  gas_estimate: string;
}> {
  return {
    contract_call: 'TAMVRegistry.anchor',
    args: {
      entryId: entry.id,
      payloadHash: entry.payload_hash,
      chainHash: entry.chain_hash,
      actorDid: entry.actor_did,
      timestamp: entry.timestamp,
      eventType: entry.type,
    },
    gas_estimate: '~50000',
  };
}

/**
 * Record external ledger confirmation
 */
export function confirmLedgerTx(entry: MSREntry, txId: string): MSREntry {
  return {
    ...entry,
    ledger_tx_id: txId,
    ledger_ready: false,
  };
}

/**
 * Get current chain head hash
 */
export function getChainHead(): string {
  return chainHead;
}
