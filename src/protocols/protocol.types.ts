// src/protocols/protocol.engine.ts
// PROTOCOLOS TAMV — MOTOR CIVILIZATORIO

import { z } from "zod";
import {
  MSRThreatEngine,
  MSRThreatConfig,
} from "@/msr/msr.threat.engine";
import {
  MSRThreatContext,
  MSRThreatLevel,
} from "@/msr/msr.threat.types";

// ─────────────────────────────
// Tipos base (del .types.ts)
// ─────────────────────────────

export type ProtocolId =
  | "protocolo-hoyo-negro"
  | "protocolo-fenix";

export type ProtocolState =
  | "idle"
  | "arming"
  | "active"
  | "contained"
  | "recovering"
  | "terminated";

export type ProtocolAuthority =
  | "system"
  | "guardiania"
  | "eoct";

export type ProtocolIrreversibility =
  | "soft"
  | "guarded"
  | "hard";

export type ProtocolThreatLevel =
  | "low"
  | "medium"
  | "high"
  | "existential";

export type ProtocolImpactDomain =
  | "security"
  | "infrastructure"
  | "economy"
  | "identity"
  | "governance"
  | "xr"
  | "global"
  | "human_life";

export interface ProtocolApproval {
  approverId: string;
  role: ProtocolAuthority;
  approvedAt: number;
  signatureRef?: string;
}

export interface ProtocolGuardrails {
  minApprovals?: number;
  requireEOCT?: boolean;
  requireOnChainVote?: boolean;
  maxConcurrentCritical?: number;
  legitimacyThreshold?: number;
}

export type ProtocolActivationMode =
  | "automatic"
  | "eoct_vote"
  | "onchain_vote";

export interface ProtocolTrigger {
  protocolId: ProtocolId;
  authority: ProtocolAuthority;
  reason: string;

  threatLevel: ProtocolThreatLevel;
  impactDomains: ProtocolImpactDomain[];

  activationMode: ProtocolActivationMode;

  relatedThreatId?: string;
  relatedMSRBlockIndex?: number;
  relatedAnchorId?: string;

  ts: number;
}

export interface ProtocolContext {
  id: ProtocolId;
  episodeId: string;

  state: ProtocolState;
  irreversibility: ProtocolIrreversibility;

  activatedAt?: number;
  lastUpdate: number;

  authority?: ProtocolAuthority;
  activationMode?: ProtocolActivationMode;
  reason?: string;

  guardrails: ProtocolGuardrails;
  approvals: ProtocolApproval[];

  rtoMinutes?: number;
  rpoMinutes?: number;

  lastThreatLevel?: ProtocolThreatLevel;
  lastThreatId?: string;

  lastMSRBlockIndex?: number;
  lastAnchorId?: string;
}

export interface ProtocolDecision {
  allowed: boolean;
  escalate: boolean;
  reason: string;

  requiresEOCT?: boolean;
  requiresOnChainVote?: boolean;
  missingApprovals?: number;

  ethicalCost?: number;
  legitimacyAtDecision?: number;
  relatedMSRBlockIndex?: number;
}

// ─────────────────────────────
// ProtocolConfig
// ─────────────────────────────

export interface ProtocolConfig {
  id: ProtocolId;
  defaultIrreversibility: ProtocolIrreversibility;
  guardrails: ProtocolGuardrails;
  defaultRtoMinutes?: number;
  defaultRpoMinutes?: number;
}

// Config por protocolo
export const PROTOCOL_CONFIGS: Record<ProtocolId, ProtocolConfig> = {
  "protocolo-hoyo-negro": {
    id: "protocolo-hoyo-negro",
    defaultIrreversibility: "guarded",
    guardrails: {
      minApprovals: 2,
      requireEOCT: true,
      requireOnChainVote: false,
      maxConcurrentCritical: 1,
      legitimacyThreshold: 0.7,
    },
    defaultRtoMinutes: 120,
    defaultRpoMinutes: 10,
  },
  "protocolo-fenix": {
    id: "protocolo-fenix",
    defaultIrreversibility: "hard",
    guardrails: {
      minApprovals: 3,
      requireEOCT: true,
      requireOnChainVote: true,
      maxConcurrentCritical: 1,
      legitimacyThreshold: 0.85,
    },
    defaultRtoMinutes: 720,
    defaultRpoMinutes: 60,
  },
};

// ─────────────────────────────
// Validadores Zod
// ─────────────────────────────

export const ProtocolIdSchema = z.enum([
  "protocolo-hoyo-negro",
  "protocolo-fenix",
]);

export const ProtocolStateSchema = z.enum([
  "idle",
  "arming",
  "active",
  "contained",
  "recovering",
  "terminated",
]);

export const ProtocolAuthoritySchema = z.enum([
  "system",
  "guardiania",
  "eoct",
]);

export const ProtocolIrreversibilitySchema = z.enum([
  "soft",
  "guarded",
  "hard",
]);

export const ProtocolThreatLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "existential",
]);

export const ProtocolImpactDomainSchema = z.enum([
  "security",
  "infrastructure",
  "economy",
  "identity",
  "governance",
  "xr",
  "global",
  "human_life",
]);

export const ProtocolActivationModeSchema = z.enum([
  "automatic",
  "eoct_vote",
  "onchain_vote",
]);

export const ProtocolApprovalSchema = z.object({
  approverId: z.string().min(1),
  role: ProtocolAuthoritySchema,
  approvedAt: z.number().int().nonnegative(),
  signatureRef: z.string().optional(),
});

export const ProtocolGuardrailsSchema = z.object({
  minApprovals: z.number().int().positive().optional(),
  requireEOCT: z.boolean().optional(),
  requireOnChainVote: z.boolean().optional(),
  maxConcurrentCritical: z.number().int().positive().optional(),
  legitimacyThreshold: z.number().min(0).max(1).optional(),
});

export const ProtocolTriggerSchema = z.object({
  protocolId: ProtocolIdSchema,
  authority: ProtocolAuthoritySchema,
  reason: z.string().min(3),

  threatLevel: ProtocolThreatLevelSchema,
  impactDomains: z.array(ProtocolImpactDomainSchema).nonempty(),

  activationMode: ProtocolActivationModeSchema,

  relatedThreatId: z.string().optional(),
  relatedMSRBlockIndex: z.number().int().nonnegative().optional(),
  relatedAnchorId: z.string().optional(),

  ts: z.number().int().nonnegative(),
});

export const ProtocolContextSchema = z.object({
  id: ProtocolIdSchema,
  episodeId: z.string().min(1),

  state: ProtocolStateSchema,
  irreversibility: ProtocolIrreversibilitySchema,

  activatedAt: z.number().int().nonnegative().optional(),
  lastUpdate: z.number().int().nonnegative(),

  authority: ProtocolAuthoritySchema.optional(),
  activationMode: ProtocolActivationModeSchema.optional(),
  reason: z.string().optional(),

  guardrails: ProtocolGuardrailsSchema,
  approvals: z.array(ProtocolApprovalSchema),

  rtoMinutes: z.number().positive().optional(),
  rpoMinutes: z.number().positive().optional(),

  lastThreatLevel: ProtocolThreatLevelSchema.optional(),
  lastThreatId: z.string().optional(),

  lastMSRBlockIndex: z.number().int().nonnegative().optional(),
  lastAnchorId: z.string().optional(),
});

export const ProtocolDecisionSchema = z.object({
  allowed: z.boolean(),
  escalate: z.boolean(),
  reason: z.string(),

  requiresEOCT: z.boolean().optional(),
  requiresOnChainVote: z.boolean().optional(),
  missingApprovals: z.number().int().nonnegative().optional(),

  ethicalCost: z.number().min(0).max(1).optional(),
  legitimacyAtDecision: z.number().min(0).max(1).optional(),
});

// ─────────────────────────────
// Engine de protocolos
// ─────────────────────────────

export class ProtocolEngine {
  private contexts: Map<ProtocolId, ProtocolContext> = new Map();

  constructor(
    private readonly msrThreat: MSRThreatEngine,
    private readonly protocolConfigs: Record<ProtocolId, ProtocolConfig> = PROTOCOL_CONFIGS,
  ) {
    for (const id of ProtocolIdSchema.options) {
      this.contexts.set(id, this.createInitialContext(id));
    }
  }

  private createInitialContext(id: ProtocolId): ProtocolContext {
    const cfg = this.protocolConfigs[id];
    return {
      id,
      episodeId: `${id}_${Date.now()}_seed`,
      state: "idle",
      irreversibility: cfg.defaultIrreversibility,
      lastUpdate: Date.now(),
      guardrails: cfg.guardrails,
      approvals: [],
      rtoMinutes: cfg.defaultRtoMinutes,
      rpoMinutes: cfg.defaultRpoMinutes,
    };
  }

  getContext(id: ProtocolId): ProtocolContext {
    const ctx = this.contexts.get(id);
    if (!ctx) throw new Error(`Unknown protocol: ${id}`);
    return ctx;
  }

  /**
   * Evalúa si se puede armar/activar un protocolo bajo un trigger dado.
   * NO cambia estado; solo devuelve un veredicto.
   */
  evaluateTrigger(trigger: ProtocolTrigger): ProtocolDecision {
    ProtocolTriggerSchema.parse(trigger);

    const ctx = this.getContext(trigger.protocolId);
    const cfg = this.protocolConfigs[trigger.protocolId];

    if (ctx.state !== "idle" && ctx.state !== "contained") {
      return {
        allowed: false,
        escalate: true,
        reason: `Protocol ${trigger.protocolId} is already in state ${ctx.state}.`,
        requiresEOCT: true,
      };
    }

    if (trigger.threatLevel === "existential" && cfg.guardrails.requireEOCT) {
      return {
        allowed: false,
        escalate: true,
        reason: "Existential threat requires explicit EOCT approval.",
        requiresEOCT: true,
        requiresOnChainVote: cfg.guardrails.requireOnChainVote,
      };
    }

    return {
      allowed: true,
      escalate: trigger.threatLevel === "existential",
      reason: "Trigger compatible with protocol guardrails.",
      requiresEOCT: cfg.guardrails.requireEOCT,
      requiresOnChainVote: cfg.guardrails.requireOnChainVote,
    };
  }

  /**
   * Aplica un trigger aprobado: pasa a "arming".
   */
  arm(trigger: ProtocolTrigger): ProtocolContext {
    const decision = this.evaluateTrigger(trigger);
    if (!decision.allowed) {
      throw new Error(`Protocol not allowed: ${decision.reason}`);
    }

    const prev = this.getContext(trigger.protocolId);
    const episodeId = `${trigger.protocolId}_${Date.now()}`;

    const next: ProtocolContext = {
      ...prev,
      episodeId,
      state: "arming",
      lastUpdate: Date.now(),
      authority: trigger.authority,
      activationMode: trigger.activationMode,
      reason: trigger.reason,
      lastThreatLevel: trigger.threatLevel,
      lastThreatId: trigger.relatedThreatId,
      lastMSRBlockIndex: trigger.relatedMSRBlockIndex,
      lastAnchorId: trigger.relatedAnchorId,
    };

    this.contexts.set(trigger.protocolId, next);
    return next;
  }

  /**
   * Añade una aprobación humana/institucional.
   */
  addApproval(id: ProtocolId, approval: ProtocolApproval): ProtocolContext {
    ProtocolApprovalSchema.parse(approval);

    const ctx = this.getContext(id);
    const next: ProtocolContext = {
      ...ctx,
      approvals: [...ctx.approvals, approval],
      lastUpdate: Date.now(),
    };

    this.contexts.set(id, next);
    return next;
  }

  /**
   * Intenta pasar de "arming" a "active" si se cumplen guardrails.
   */
  activate(id: ProtocolId): ProtocolDecision {
    const ctx = this.getContext(id);
    const cfg = this.protocolConfigs[id];

    if (ctx.state !== "arming") {
      return {
        allowed: false,
        escalate: false,
        reason: `Protocol ${id} is not in arming state.`,
      };
    }

    const approvals = ctx.approvals.length;
    const required = ctx.guardrails.minApprovals ?? 0;
    const missing = Math.max(0, required - approvals);

    if (missing > 0) {
      return {
        allowed: false,
        escalate: true,
        reason: `Protocol ${id} missing ${missing} approvals.`,
        missingApprovals: missing,
        requiresEOCT: ctx.guardrails.requireEOCT,
        requiresOnChainVote: ctx.guardrails.requireOnChainVote,
      };
    }

    const legitimacy =
      required > 0 ? approvals / required : 1;

    const next: ProtocolContext = {
      ...ctx,
      state: "active",
      activatedAt: Date.now(),
      lastUpdate: Date.now(),
    };

    this.contexts.set(id, next);

    return {
      allowed: true,
      escalate: false,
      reason: `Protocol ${id} activated.`,
      legitimacyAtDecision: legitimacy,
      ethicalCost: id === "protocolo-fenix" ? 0.9 : 0.6,
      requiresEOCT: ctx.guardrails.requireEOCT,
      requiresOnChainVote: ctx.guardrails.requireOnChainVote,
    };
  }

  /**
   * Marca amenaza contenida, pasa a "contained".
   */
  markContained(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (ctx.state !== "active") return ctx;

    const next: ProtocolContext = {
      ...ctx,
      state: "contained",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }

  /**
   * Pasa a "recovering".
   */
  startRecovery(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (ctx.state !== "contained") return ctx;

    const next: ProtocolContext = {
      ...ctx,
      state: "recovering",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }

  /**
   * Termina protocolo, pasa a "terminated".
   */
  terminate(id: ProtocolId): ProtocolContext {
    const ctx = this.getContext(id);
    if (ctx.state === "terminated") return ctx;

    const next: ProtocolContext = {
      ...ctx,
      state: "terminated",
      lastUpdate: Date.now(),
    };
    this.contexts.set(id, next);
    return next;
  }

  // Integración ligera con MSRThreatEngine
  bindThreatContext(id: ProtocolId, ctx: MSRThreatContext): void {
    const proto = this.getContext(id);
    const next: ProtocolContext = {
      ...proto,
      lastThreatLevel: ctx.currentLevel === "existential" ? "existential" : "high",
      lastThreatId: ctx.lastSignal?.id,
    };
    this.contexts.set(id, next);
  }
}

// ─────────────────────────────
// Ejemplos de uso
// ─────────────────────────────

async function ejemploHoyoNegro() {
  const threatEngine = new MSRThreatEngine();
  const protocolEngine = new ProtocolEngine(threatEngine);

  // Bind contexto de amenaza
  const threatCtx = threatEngine.getContext();
  protocolEngine.bindThreatContext("protocolo-hoyo-negro", threatCtx);

  const trigger: ProtocolTrigger = {
    protocolId: "protocolo-hoyo-negro",
    authority: "guardiania",
    reason: "Ataque coordinado a infraestructura XR.",
    threatLevel: "high",
    impactDomains: ["security", "infrastructure", "xr"],
    activationMode: "eoct_vote",
    ts: Date.now(),
  };

  const decision = protocolEngine.evaluateTrigger(trigger);
  if (!decision.allowed) return;

  const ctxArming = protocolEngine.arm(trigger);

  protocolEngine.addApproval("protocolo-hoyo-negro", {
    approverId: "EOCT_1",
    role: "eoct",
    approvedAt: Date.now(),
  });
  protocolEngine.addApproval("protocolo-hoyo-negro", {
    approverId: "GUARDIANIA_1",
    role: "guardiania",
    approvedAt: Date.now(),
  });

  const activateDecision = protocolEngine.activate("protocolo-hoyo-negro");
  // luego: markContained, startRecovery, terminate...
}

async function ejemploFenixExistencial() {
  const threatEngine = new MSRThreatEngine({
    escalationThreshold: "high",
    existentialThreshold: "existential",
  });
  const protocolEngine = new ProtocolEngine(threatEngine);

  const trigger: ProtocolTrigger = {
    protocolId: "protocolo-fenix",
    authority: "eoct",
    reason: "Compromiso existencial de identidad y economía.",
    threatLevel: "existential",
    impactDomains: ["identity", "economy", "governance", "global"],
    activationMode: "onchain_vote",
    ts: Date.now(),
  };

  const decision = protocolEngine.evaluateTrigger(trigger);
  if (!decision.allowed) return;

  protocolEngine.arm(trigger);
  // proceso análogo, pero con más guardrails...
}
