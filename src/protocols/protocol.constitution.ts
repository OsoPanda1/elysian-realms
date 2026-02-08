// src/protocols/protocol.constitution.ts
// PROTOCOLOS TAMV — PUERTA CONSTITUCIONAL CIVILIZATORIA (MEGA BLINDADA)

import {
  ProtocolTrigger,
  ProtocolDecision,
  ProtocolId,
  ProtocolThreatLevel,
  ProtocolAuthority,
} from "./protocol.types";

// ───────────────────────────────────────────
// Modelo de reglas constitucionales
// ───────────────────────────────────────────

export interface ProtocolConstitutionRule {
  id: ProtocolId;

  // Legitimidad mínima para permitir armado/activación
  minLegitimacy: number;               // 0..1
  minLegitimacyExistential?: number;   // override para amenazas existenciales

  // Autoridades que pueden disparar el protocolo
  allowedAuthorities: ProtocolAuthority[];

  // Amenaza mínima requerida
  minThreatLevel: ProtocolThreatLevel;

  // Requisitos estructurales
  requiresEOCT: boolean;
  requiresOnChainVote: boolean;

  // Comentario civilizatorio (para depuración y auditoría)
  doctrineNote: string;
}

// Reglas canónicas para TAMV (ley viva pero estricta)
export const PROTOCOL_RULES: Record<ProtocolId, ProtocolConstitutionRule> = {
  "protocolo-hoyo-negro": {
    id: "protocolo-hoyo-negro",
    minLegitimacy: 0.6,
    minLegitimacyExistential: 0.75,
    allowedAuthorities: ["guardiania", "eoct"],
    minThreatLevel: "high",
    requiresEOCT: true,
    requiresOnChainVote: false,
    doctrineNote:
      "Hoyo Negro es contención extrema pero reversible con costo; nunca debe ser disparado con baja legitimidad.",
  },
  "protocolo-fenix": {
    id: "protocolo-fenix",
    minLegitimacy: 0.8,
    minLegitimacyExistential: 0.9,
    allowedAuthorities: ["eoct"],
    minThreatLevel: "existential",
    requiresEOCT: true,
    requiresOnChainVote: true,
    doctrineNote:
      "Fénix es resurrección civilizatoria; solo procede ante amenaza existencial y legitimidad casi total.",
  },
};

// ───────────────────────────────────────────
// Utilidades internas
// ───────────────────────────────────────────

const THREAT_WEIGHT: Record<ProtocolThreatLevel, number> = {
  low: 0,
  medium: 1,
  high: 2,
  existential: 3,
};

function threatGte(a: ProtocolThreatLevel, b: ProtocolThreatLevel): boolean {
  return THREAT_WEIGHT[a] >= THREAT_WEIGHT[b];
}

function formatLegitimacy(v: number): string {
  return v.toFixed(2);
}

// ───────────────────────────────────────────
// Verificación constitucional central
// ───────────────────────────────────────────

/**
 * Verifica autoridad contra reglas constitucionales.
 */
function checkAuthority(
  rule: ProtocolConstitutionRule,
  trigger: ProtocolTrigger,
): ProtocolDecision | null {
  if (!rule.allowedAuthorities.includes(trigger.authority)) {
    return {
      allowed: false,
      escalate: true,
      reason: `Autoridad ${trigger.authority} no autorizada para ${trigger.protocolId}.`,
      requiresEOCT: rule.requiresEOCT,
      requiresOnChainVote: rule.requiresOnChainVote,
    };
  }
  return null;
}

/**
 * Verifica nivel de amenaza mínimo requerido.
 */
function checkThreatLevel(
  rule: ProtocolConstitutionRule,
  trigger: ProtocolTrigger,
): ProtocolDecision | null {
  if (!threatGte(trigger.threatLevel, rule.minThreatLevel)) {
    return {
      allowed: false,
      escalate: true,
      reason: `Nivel de amenaza ${trigger.threatLevel} insuficiente para ${trigger.protocolId}; se requiere al menos ${rule.minThreatLevel}.`,
      requiresEOCT: rule.requiresEOCT,
      requiresOnChainVote: rule.requiresOnChainVote,
    };
  }
  return null;
}

/**
 * Verifica legitimidad mínima requerida.
 */
function checkLegitimacy(
  rule: ProtocolConstitutionRule,
  trigger: ProtocolTrigger,
  legitimacy: number,
): ProtocolDecision | null {
  const required =
    trigger.threatLevel === "existential" &&
    rule.minLegitimacyExistential !== undefined
      ? rule.minLegitimacyExistential
      : rule.minLegitimacy;

  if (legitimacy < required) {
    return {
      allowed: false,
      escalate: true,
      reason: `Legitimidad ${formatLegitimacy(
        legitimacy,
      )} inferior al mínimo requerido ${formatLegitimacy(
        required,
      )} para ${trigger.protocolId}.`,
      requiresEOCT: rule.requiresEOCT,
      requiresOnChainVote: rule.requiresOnChainVote,
      legitimacyAtDecision: legitimacy,
    };
  }

  return null;
}

// ───────────────────────────────────────────
// API principal: puerta constitucional
// ───────────────────────────────────────────

/**
 * Puerta constitucional para protocolos soberanos TAMV.
 *
 * - NO ejecuta acciones, sólo emite un veredicto consistente y explicable.
 * - No asume buena fe de ningún actor (system, guardianía, EOCT).
 * - Siempre prioriza seguridad civilizatoria sobre conveniencia local.
 */
export function constitutionalProtocolGate(
  trigger: ProtocolTrigger,
  legitimacy: number,
): ProtocolDecision {
  const rule = PROTOCOL_RULES[trigger.protocolId];

  // 0) Sanitizar legitimidad fuera de rango por errores aguas arriba
  if (Number.isNaN(legitimacy) || !Number.isFinite(legitimacy)) {
    return {
      allowed: false,
      escalate: true,
      reason: "Legitimidad inválida (NaN o infinita).",
      requiresEOCT: true,
      requiresOnChainVote: true,
    };
  }
  const safeLegitimacy = Math.max(0, Math.min(1, legitimacy));

  // 1) Autoridad
  const authorityDecision = checkAuthority(rule, trigger);
  if (authorityDecision) return authorityDecision;

  // 2) Nivel de amenaza
  const threatDecision = checkThreatLevel(rule, trigger);
  if (threatDecision) return threatDecision;

  // 3) Legitimidad
  const legitimacyDecision = checkLegitimacy(
    rule,
    trigger,
    safeLegitimacy,
  );
  if (legitimacyDecision) return legitimacyDecision;

  // 4) Si pasa todo, la Constitución permite armar el protocolo,
  // pero aún se requiere cumplir guardrails (EOCT, on-chain, etc.)
  return {
    allowed: true,
    escalate: false,
    reason: `Autorizado por Constitución TAMV (${rule.doctrineNote}).`,
    requiresEOCT: rule.requiresEOCT,
    requiresOnChainVote: rule.requiresOnChainVote,
    legitimacyAtDecision: safeLegitimacy,
    ethicalCost:
      trigger.protocolId === "protocolo-fenix" ? 0.9 : 0.6,
  };
}
