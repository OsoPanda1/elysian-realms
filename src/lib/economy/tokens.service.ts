/**
 * Tokens de uso interno TAMV — No financieros.
 * Créditos de uso (cómputo, XR, almacenamiento) y puntos de contribución.
 */

import { ledger, SYSTEM_POOLS, type LedgerUnit } from "./ledger.internal";

export interface TokenBalance {
  usageCredits: number;
  contributionPoints: number;
}

/**
 * Acuña créditos de uso para un usuario.
 */
export async function mintUsageCredits(
  userId: string,
  amount: number,
  reason: string,
) {
  return ledger.record({
    fromAccount: SYSTEM_POOLS.SYSTEM,
    toAccount: `user:${userId}`,
    amount,
    unit: "usage_credit",
    type: "mint",
    reason,
  });
}

/**
 * Quema créditos de uso al consumir recursos.
 */
export async function burnUsageCredits(
  userId: string,
  amount: number,
  reason: string,
) {
  return ledger.record({
    fromAccount: `user:${userId}`,
    toAccount: SYSTEM_POOLS.INFRA,
    amount,
    unit: "usage_credit",
    type: "burn",
    reason,
  });
}

/**
 * Registra una contribución verificable.
 */
export async function recordContribution(
  userId: string,
  contributionType: string,
  weight: number,
) {
  return ledger.record({
    fromAccount: SYSTEM_POOLS.SYSTEM,
    toAccount: `user:${userId}`,
    amount: weight,
    unit: "contribution_point",
    type: "reward",
    reason: `contribution:${contributionType}`,
  });
}

/**
 * Transfiere créditos de uso entre usuarios (interno, no financiero).
 */
export async function transferCredits(
  fromUserId: string,
  toUserId: string,
  amount: number,
  reason: string,
) {
  return ledger.record({
    fromAccount: `user:${fromUserId}`,
    toAccount: `user:${toUserId}`,
    amount,
    unit: "usage_credit",
    type: "transfer",
    reason,
  });
}

/**
 * Obtiene el balance de tokens de un usuario.
 */
export function getTokenBalance(userId: string): TokenBalance {
  const account = `user:${userId}`;
  return {
    usageCredits: ledger.getBalance(account, "usage_credit"),
    contributionPoints: ledger.getBalance(account, "contribution_point"),
  };
}
