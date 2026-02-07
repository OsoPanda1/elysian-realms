/**
 * EOCT™ — Emergency Operations & Coordination Team TAMV
 * Centro de mando que coordina respuestas a incidentes
 */

import { log } from './horus';
import { type SecurityIncident, type SecurityLevel } from './anubis-sentinel';
import { type RadarReading } from './radars';
import { type Guardian } from './guardianias';
import { anchorEvent } from './bookpi';

export type EOCTLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' | 'BLACK';

export type ProtocolType =
  | 'STANDARD_RESPONSE'
  | 'ELEVATED_MONITORING'
  | 'HOYO_NEGRO'     // Controlled shutdown / lockdown
  | 'FENIX'          // Recovery protocol
  | 'INICIACION';    // Onboarding / trust elevation

export interface EOCTState {
  level: EOCTLevel;
  active_protocols: ProtocolType[];
  pending_signals: EOCTSignal[];
  last_assessment: string;
}

export interface EOCTSignal {
  id: string;
  source: 'anubis' | 'horus' | 'radar' | 'guardian' | 'isabella' | 'manual';
  severity: SecurityLevel;
  payload: Record<string, unknown>;
  timestamp: string;
  processed: boolean;
}

// Global EOCT state
const state: EOCTState = {
  level: 'GREEN',
  active_protocols: [],
  pending_signals: [],
  last_assessment: new Date().toISOString(),
};

/**
 * Receive signal from any TAMV subsystem
 */
export function receiveSignal(
  source: EOCTSignal['source'],
  severity: SecurityLevel,
  payload: Record<string, unknown>
): EOCTSignal {
  const signal: EOCTSignal = {
    id: crypto.randomUUID(),
    source,
    severity,
    payload,
    timestamp: new Date().toISOString(),
    processed: false,
  };

  state.pending_signals.push(signal);
  log('info', 'EOCT', `Signal received from ${source}: ${severity}`, payload);

  // Auto-assess
  assessThreatLevel();

  return signal;
}

/**
 * Assess overall threat level based on signals
 */
function assessThreatLevel(): void {
  const unprocessed = state.pending_signals.filter(s => !s.processed);
  const criticals = unprocessed.filter(s => s.severity === 'CRITICAL' || s.severity === 'LOCKDOWN');
  const warnings = unprocessed.filter(s => s.severity === 'WARNING');

  if (criticals.length >= 3) {
    state.level = 'RED';
  } else if (criticals.length >= 1) {
    state.level = 'ORANGE';
  } else if (warnings.length >= 5) {
    state.level = 'YELLOW';
  } else {
    state.level = 'GREEN';
  }

  state.last_assessment = new Date().toISOString();
}

/**
 * Activate a protocol
 */
export async function activateProtocol(
  protocol: ProtocolType,
  userId: string,
  reason: string
): Promise<void> {
  if (!state.active_protocols.includes(protocol)) {
    state.active_protocols.push(protocol);
  }

  log('warn', 'EOCT', `Protocol activated: ${protocol}`, { reason, userId });

  if (protocol === 'HOYO_NEGRO' || protocol === 'FENIX') {
    state.level = protocol === 'HOYO_NEGRO' ? 'BLACK' : 'ORANGE';
    await anchorEvent('GOVERNANCE_EVENT', userId, {
      protocol,
      reason,
      eoct_level: state.level,
    }, `EOCT_${protocol}`);
  }
}

/**
 * Deactivate a protocol
 */
export function deactivateProtocol(protocol: ProtocolType): void {
  state.active_protocols = state.active_protocols.filter(p => p !== protocol);
  assessThreatLevel();
  log('info', 'EOCT', `Protocol deactivated: ${protocol}`);
}

/**
 * Get current EOCT state
 */
export function getEOCTState(): EOCTState {
  return { ...state, pending_signals: [...state.pending_signals] };
}

/**
 * Process and clear signals
 */
export function processSignals(): EOCTSignal[] {
  const processed = state.pending_signals.filter(s => !s.processed);
  processed.forEach(s => { s.processed = true; });
  return processed;
}
