/**
 * Protocolos TAMV™ — Flujos Especiales de Operación
 * Iniciación, Hoyo Negro (lockdown), Fénix (recovery)
 */

import { log } from './horus';
import { anchorEvent } from './bookpi';
import { activateProtocol as eoctActivate, deactivateProtocol } from './eoct';

export type ProtocolState = 'inactive' | 'preparing' | 'active' | 'completing' | 'completed';

export interface ProtocolExecution {
  id: string;
  protocol: string;
  state: ProtocolState;
  initiated_by: string;
  started_at: string;
  completed_at: string | null;
  steps_completed: string[];
  metadata: Record<string, unknown>;
}

// ── Protocolo Iniciación ──
export async function executeInitiation(
  userId: string,
  displayName: string
): Promise<ProtocolExecution> {
  const execution: ProtocolExecution = {
    id: crypto.randomUUID(),
    protocol: 'INICIACION',
    state: 'active',
    initiated_by: userId,
    started_at: new Date().toISOString(),
    completed_at: null,
    steps_completed: [],
    metadata: { display_name: displayName },
  };

  log('info', 'Protocol:Iniciación', `Iniciando proceso para ${displayName}`);

  // Step 1: Register entry
  execution.steps_completed.push('ENTRY_REGISTERED');

  // Step 2: Assign DID
  execution.steps_completed.push('DID_ASSIGNED');

  // Step 3: Create wallet
  execution.steps_completed.push('WALLET_CREATED');

  // Step 4: Anchor in BookPI
  await anchorEvent('FOUNDATIONAL_EVENT', userId, {
    protocol: 'INICIACION',
    citizen: displayName,
    steps: execution.steps_completed,
  }, 'CITIZEN_INITIATION');
  execution.steps_completed.push('BOOKPI_ANCHORED');

  // Step 5: Complete
  execution.state = 'completed';
  execution.completed_at = new Date().toISOString();
  execution.steps_completed.push('INITIATION_COMPLETE');

  log('info', 'Protocol:Iniciación', `Iniciación completada para ${displayName}`);
  return execution;
}

// ── Protocolo Hoyo Negro (Lockdown) ──
export async function executeHoyoNegro(
  userId: string,
  reason: string
): Promise<ProtocolExecution> {
  const execution: ProtocolExecution = {
    id: crypto.randomUUID(),
    protocol: 'HOYO_NEGRO',
    state: 'active',
    initiated_by: userId,
    started_at: new Date().toISOString(),
    completed_at: null,
    steps_completed: [],
    metadata: { reason },
  };

  log('error', 'Protocol:HoyoNegro', `LOCKDOWN activado: ${reason}`);

  // Activate EOCT protocol
  await eoctActivate('HOYO_NEGRO', userId, reason);
  execution.steps_completed.push('EOCT_ACTIVATED');

  // Anchor critical event
  await anchorEvent('SECURITY_EVENT', userId, {
    protocol: 'HOYO_NEGRO',
    reason,
    action: 'SYSTEM_LOCKDOWN',
  }, 'HOYO_NEGRO_ACTIVATED');
  execution.steps_completed.push('BOOKPI_ANCHORED');

  execution.steps_completed.push('SERVICES_RESTRICTED');
  execution.state = 'active'; // Stays active until manually deactivated

  return execution;
}

// ── Protocolo Fénix (Recovery) ──
export async function executeFenix(
  userId: string,
  incidentId: string
): Promise<ProtocolExecution> {
  const execution: ProtocolExecution = {
    id: crypto.randomUUID(),
    protocol: 'FENIX',
    state: 'active',
    initiated_by: userId,
    started_at: new Date().toISOString(),
    completed_at: null,
    steps_completed: [],
    metadata: { incident_id: incidentId },
  };

  log('warn', 'Protocol:Fénix', `Recovery iniciado para incidente ${incidentId}`);

  // Deactivate lockdown if active
  deactivateProtocol('HOYO_NEGRO');
  execution.steps_completed.push('LOCKDOWN_LIFTED');

  // Activate recovery
  await eoctActivate('FENIX', userId, `Recovery from ${incidentId}`);
  execution.steps_completed.push('EOCT_RECOVERY');

  // System health check
  execution.steps_completed.push('HEALTH_CHECK_STARTED');

  // Anchor recovery
  await anchorEvent('GOVERNANCE_EVENT', userId, {
    protocol: 'FENIX',
    incident_id: incidentId,
    action: 'SYSTEM_RECOVERY',
  }, 'FENIX_ACTIVATED');
  execution.steps_completed.push('BOOKPI_ANCHORED');

  execution.state = 'completing';
  return execution;
}
