/**
 * Tipos de guardianía — compartidos entre guardianías y cognición.
 */

export type GuardianiaStatus = "idle" | "watching" | "alert" | "escalated";

export interface GuardianiaContext {
  id: string;
  name: string;
  status: GuardianiaStatus;
  lastCheck: number;
  notes?: string;
}

export interface ManualProtocolTrigger {
  id: string;
  protocolId: string;
  reason: string;
  requestedBy: string;
  targetId?: string;
  scope?: string;
  createdAt: number;
}
