/**
 * Guardianías™ — Watchers/Demonios Lógicos TAMV
 * Vigilan estados críticos, disparan alertas y anchors BookPI
 */

import { log, queryLogs, getHealth } from './horus';
import { getIncidents, reportIncident } from './anubis-sentinel';
import { anchorEvent } from './bookpi';

export type GuardianStatus = 'watching' | 'alert' | 'intervening' | 'dormant';

export interface Guardian {
  id: string;
  name: string;
  domain: string;
  status: GuardianStatus;
  last_check: string;
  alerts_triggered: number;
}

const guardians: Guardian[] = [
  {
    id: 'guardian-auth',
    name: 'Guardián de Identidad',
    domain: 'authentication',
    status: 'watching',
    last_check: new Date().toISOString(),
    alerts_triggered: 0,
  },
  {
    id: 'guardian-economy',
    name: 'Guardián Económico',
    domain: 'economy',
    status: 'watching',
    last_check: new Date().toISOString(),
    alerts_triggered: 0,
  },
  {
    id: 'guardian-xr',
    name: 'Guardián XR',
    domain: 'xr_spaces',
    status: 'watching',
    last_check: new Date().toISOString(),
    alerts_triggered: 0,
  },
  {
    id: 'guardian-ethics',
    name: 'Guardián Ético',
    domain: 'ethics',
    status: 'watching',
    last_check: new Date().toISOString(),
    alerts_triggered: 0,
  },
];

/**
 * Run all guardian checks
 */
export async function runGuardianSweep(userId?: string): Promise<Guardian[]> {
  const health = getHealth();
  const recentErrors = queryLogs({ level: 'error', limit: 20 });
  const incidents = getIncidents();

  for (const guardian of guardians) {
    guardian.last_check = new Date().toISOString();

    // Check system health
    if (health.status === 'unhealthy') {
      guardian.status = 'alert';
      guardian.alerts_triggered++;
      log('error', `Guardian:${guardian.name}`, 'Sistema en estado unhealthy');
    }

    // Check domain-specific errors
    const domainErrors = recentErrors.filter(e =>
      e.module.toLowerCase().includes(guardian.domain)
    );
    if (domainErrors.length > 5) {
      guardian.status = 'intervening';
      guardian.alerts_triggered++;
      log('warn', `Guardian:${guardian.name}`, `${domainErrors.length} errores en dominio ${guardian.domain}`);
    }

    // Check critical incidents
    const criticalIncidents = incidents.filter(i => i.level === 'CRITICAL' && !i.mitigated);
    if (criticalIncidents.length > 0 && guardian.domain === 'authentication') {
      guardian.status = 'intervening';
      if (userId) {
        await anchorEvent('SECURITY_EVENT', userId, {
          guardian: guardian.id,
          reason: 'critical_incidents_detected',
          count: criticalIncidents.length,
        }, 'GUARDIAN_ALERT');
      }
    }

    // Reset to watching if clear
    if (guardian.status !== 'alert' && guardian.status !== 'intervening') {
      guardian.status = 'watching';
    }
  }

  return [...guardians];
}

/**
 * Get current guardian statuses
 */
export function getGuardianStatuses(): Guardian[] {
  return [...guardians];
}

/**
 * Activate specific guardian protocol
 */
export async function activateProtocol(
  guardianId: string,
  protocol: string,
  userId: string
): Promise<void> {
  const guardian = guardians.find(g => g.id === guardianId);
  if (!guardian) throw new Error(`Guardian ${guardianId} not found`);

  guardian.status = 'intervening';
  log('warn', `Guardian:${guardian.name}`, `Protocolo activado: ${protocol}`);

  await reportIncident('WARNING', guardian.name, `Protocol activated: ${protocol}`, userId);
  await anchorEvent('GOVERNANCE_EVENT', userId, {
    guardian: guardianId,
    protocol,
    action: 'PROTOCOL_ACTIVATED',
  }, 'GUARDIAN_PROTOCOL');
}
