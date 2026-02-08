/**
 * Ledger Interno TAMV — Contabilidad civilizatoria.
 * Registra mint, burn, transfer y reward de créditos y contribuciones.
 */

import { supabase } from "@/integrations/supabase/client";

export type LedgerUnit = "usage_credit" | "contribution_point" | "governance_token";
export type LedgerEntryType = "mint" | "burn" | "transfer" | "reward";

export interface LedgerEntry {
  id: string;
  fromAccount: string; // "system" | "resilience_pool" | "user:<id>" | "project:<id>"
  toAccount: string;
  amount: number;
  unit: LedgerUnit;
  type: LedgerEntryType;
  reason: string;
  ts: number;
  msrBlockIndex?: number;
  anchorId?: string;
  policyId?: string;
}

// Pools especiales del sistema
export const SYSTEM_POOLS = {
  SYSTEM: "system",
  RESILIENCE: "resilience_pool",
  MEMORY: "memory_pool",
  INFRA: "infra_pool",
} as const;

/**
 * Ledger in-memory con persistencia a la tabla transactions.
 */
class InternalLedger {
  private entries: LedgerEntry[] = [];

  async record(entry: Omit<LedgerEntry, "id" | "ts">): Promise<LedgerEntry> {
    const full: LedgerEntry = {
      ...entry,
      id: `ledger_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
    };

    this.entries.push(full);

    // Persist to transactions table when involves real users
    if (
      full.fromAccount.startsWith("user:") ||
      full.toAccount.startsWith("user:")
    ) {
      const fromUserId = full.fromAccount.startsWith("user:")
        ? full.fromAccount.slice(5)
        : null;
      const toUserId = full.toAccount.startsWith("user:")
        ? full.toAccount.slice(5)
        : null;

      await supabase.from("transactions").insert({
        amount: full.amount,
        transaction_type: `${full.type}_${full.unit}`,
        description: full.reason,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        metadata: {
          ledgerEntryId: full.id,
          unit: full.unit,
          entryType: full.type,
          msrBlockIndex: full.msrBlockIndex,
          anchorId: full.anchorId,
          policyId: full.policyId,
        },
      });
    }

    return full;
  }

  getEntries(filter?: {
    account?: string;
    unit?: LedgerUnit;
    type?: LedgerEntryType;
    limit?: number;
  }): LedgerEntry[] {
    let result = [...this.entries];

    if (filter?.account) {
      result = result.filter(
        (e) => e.fromAccount === filter.account || e.toAccount === filter.account
      );
    }
    if (filter?.unit) {
      result = result.filter((e) => e.unit === filter.unit);
    }
    if (filter?.type) {
      result = result.filter((e) => e.type === filter.type);
    }

    if (filter?.limit) {
      result = result.slice(-filter.limit);
    }

    return result;
  }

  getBalance(account: string, unit: LedgerUnit): number {
    let balance = 0;
    for (const entry of this.entries) {
      if (entry.unit !== unit) continue;
      if (entry.toAccount === account) balance += entry.amount;
      if (entry.fromAccount === account) balance -= entry.amount;
    }
    return balance;
  }
}

export const ledger = new InternalLedger();
