/**
 * Anubis Sentinel™ — Guardián de Seguridad Central TAMV
 * Rate limiting adaptativo, detección de anomalías, protección de endpoints
 */

import { anchorEvent } from './bookpi';

// ── Rate Limiter ──
interface RateLimitEntry {
  count: number;
  windowStart: number;
  blocked: boolean;
}

const rateLimits = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60;
const BLOCK_DURATION_MS = 300_000; // 5 min block

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(identifier);

  if (entry?.blocked && now - entry.windowStart < BLOCK_DURATION_MS) {
    return { allowed: false, remaining: 0 };
  }

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    rateLimits.set(identifier, { count: 1, windowStart: now, blocked: false });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    entry.blocked = true;
    entry.windowStart = now;
    console.warn(`[Anubis] Rate limit exceeded for: ${identifier}`);
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// ── Threat Patterns ──
const SUSPICIOUS_PATTERNS = [
  /(<script|javascript:|on\w+=)/i,           // XSS
  /(union\s+select|drop\s+table|--\s)/i,     // SQL injection
  /(\.\.\/|\.\.\\)/,                          // Path traversal
  /(\{|\})\s*(\{|\})/,                        // Template injection
];

export function detectThreat(input: string): { safe: boolean; threat?: string } {
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(input)) {
      return { safe: false, threat: pattern.source };
    }
  }
  return { safe: true };
}

// ── Security Event Logger ──
export type SecurityLevel = 'INFO' | 'WARNING' | 'CRITICAL' | 'LOCKDOWN';

export interface SecurityIncident {
  id: string;
  level: SecurityLevel;
  source: string;
  description: string;
  timestamp: string;
  mitigated: boolean;
}

const incidents: SecurityIncident[] = [];

export async function reportIncident(
  level: SecurityLevel,
  source: string,
  description: string,
  userId?: string
): Promise<SecurityIncident> {
  const incident: SecurityIncident = {
    id: crypto.randomUUID(),
    level,
    source,
    description,
    timestamp: new Date().toISOString(),
    mitigated: false,
  };

  incidents.push(incident);

  // Anchor to BookPI for critical events
  if (level === 'CRITICAL' || level === 'LOCKDOWN') {
    try {
      await anchorEvent(
        'SECURITY_EVENT',
        userId || 'system:anubis',
        { incident_id: incident.id, level, source, description },
        `SECURITY_${level}`
      );
    } catch (e) {
      console.error('[Anubis] Failed to anchor security event:', e);
    }
  }

  return incident;
}

export function getIncidents(level?: SecurityLevel): SecurityIncident[] {
  if (level) return incidents.filter(i => i.level === level);
  return [...incidents];
}

// ── Input Sanitizer ──
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
}

// ── Session Validator ──
export function validateSession(token: string | null): boolean {
  if (!token) return false;
  // Basic JWT structure check
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
}
