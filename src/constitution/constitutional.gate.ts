// src/constitution/constitutional.gate.ts

import {
  Constitution,
  ConstitutionalRule,
  ConstitutionalVerdict,
} from "./constitution.types";
import { CognitiveDecision } from "@/cognition/cognition.types";

export class ConstitutionalGate {
  constructor(private readonly constitution: Constitution) {}

  /**
   * Evalúa una decisión cognitiva frente a TODAS las reglas aplicables.
   * Devuelve un veredicto rico, no solo booleano.
   */
  evaluateDecision(decision: CognitiveDecision): ConstitutionalVerdict {
    const applicableRules = this.findApplicableRules(decision);

    const violations: ConstitutionalVerdict["violations"] = [];

    for (const rule of applicableRules) {
      const v = this.evaluateRule(rule, decision);
      if (!v.allowed) violations.push(v);
    }

    if (!violations.length) {
      return {
        allowed: true,
        requiresEOCT: false,
        reason: "Decisión compatible con la Constitución TAMV.",
        violations: [],
      };
    }

    const requiresEOCT = violations.some((v) => v.requiresEOCT === true);

    return {
      allowed: false,
      requiresEOCT,
      reason: "Una o más reglas constitucionales serían vulneradas.",
      violations,
    };
  }

  // ───────────────────────────────────────────
  // Internals
  // ───────────────────────────────────────────

  private findApplicableRules(decision: CognitiveDecision): ConstitutionalRule[] {
    const rules: ConstitutionalRule[] = [];

    for (const article of this.constitution.articles) {
      // Filtro rápido por dominio si existe
      if (
        article.domain &&
        !this.matchesDomain(article.domain, decision.action, decision.scope)
      ) {
        continue;
      }
      rules.push(...article.rules);
    }

    return rules;
  }

  private matchesDomain(
    domain: string,
    action: string,
    scope: CognitiveDecision["scope"],
  ): boolean {
    if (domain === "cognition" && scope === "eoct") return true;
    if (domain === "security" && action.startsWith("activate_protocol_")) {
      return true;
    }
    if (domain === "economy" && action.startsWith("economic_")) {
      return true;
    }
    // Artículos sin domain o domain genérico aplican a todo
    return domain === "global" || domain === undefined;
  }

  private evaluateRule(
    rule: ConstitutionalRule,
    decision: CognitiveDecision,
  ): ConstitutionalVerdict["violations"][number] {
    // 1) Acciones explícitamente prohibidas
    if (rule.forbids && rule.forbids.includes(decision.action)) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `Acción ${decision.action} prohibida por la regla ${rule.id}.`,
      };
    }

    // 2) Tope de urgencia (equivalente a tu maxRisk)
    if (
      typeof rule.maxUrgency === "number" &&
      decision.urgency > rule.maxUrgency
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `Urgencia ${decision.urgency} excede máximo permitido ${rule.maxUrgency}.`,
      };
    }

    // 3) Umbral mínimo de urgencia que exige EOCT
    if (
      typeof rule.minUrgency === "number" &&
      decision.urgency >= rule.minUrgency &&
      rule.requiresEOCT
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: true,
        reason:
          "Urgencia muy alta: requiere revisión y firma de EOCT antes de ejecutar.",
      };
    }

    // 4) Targets prohibidos (ej. `user_harm`)
    if (
      rule.forbidsTargets &&
      rule.forbidsTargets.includes(decision.target || "")
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: !!rule.requiresEOCT,
        reason: `El objetivo ${decision.target} está prohibido por la regla ${rule.id}.`,
      };
    }

    // 5) Protocolos requeridos (informativo; no bloquea si no se define explicitamente)
    if (
      rule.requiresProtocol &&
      rule.requiresProtocol.length &&
      rule.requiresEOCT &&
      decision.urgency > (rule.maxUrgency ?? 0.9)
    ) {
      return {
        ruleId: rule.id,
        allowed: false,
        requiresEOCT: true,
        reason:
          "Acción de alta urgencia sin protocolo explícito activo ni revisión EOCT.",
        requiresProtocol: rule.requiresProtocol,
      };
    }

    // Si pasa todo, es compatible con esta regla
    return {
      ruleId: rule.id,
      allowed: true,
      requiresEOCT: false,
      reason: "Compatible con esta regla.",
    };
  }
}
