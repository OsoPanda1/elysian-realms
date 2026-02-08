/**
 * Tipos constitucionales de TAMV.
 * Define la estructura del documento constitucional y sus reglas.
 */

export type ConstitutionalLevel =
  | "absolute"     // nunca puede violarse
  | "critical"     // solo con EOCT + MSR
  | "protective";  // puede degradar acciones

export interface ConstitutionalRule {
  id: string;
  level?: ConstitutionalLevel;
  description: string;

  // Acciones explícitamente prohibidas
  forbids?: string[];
  // Targets prohibidos (ej. "user_harm")
  forbidsTargets?: string[];

  // Urgencia
  maxUrgency?: number;
  minUrgency?: number;

  // Requerimientos
  requiresEOCT?: boolean;
  requiresProtocol?: string[];

  // Evaluación pura (sin side effects) — legacy
  evaluate?: (input: { state: any; intent: any }) => boolean;
}

export interface ConstitutionArticle {
  id: string;
  title: string;
  domain: string;
  rules: ConstitutionalRule[];
}

export interface Constitution {
  id: string;
  version: string;
  createdAt: number;
  signer: string;
  articles: ConstitutionArticle[];
  hash: string;
  signature?: string;
}

/** Alias legacy */
export type TAMVConstitution = Constitution;

export interface ConstitutionalViolation {
  ruleId: string;
  allowed: boolean;
  requiresEOCT: boolean;
  reason: string;
  requiresProtocol?: string[];
}

export interface ConstitutionalVerdict {
  allowed: boolean;
  requiresEOCT: boolean;
  reason: string;
  violations: ConstitutionalViolation[];
}
