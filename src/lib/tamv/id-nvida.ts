/**
 * ID-NVIDA™ — Identidad Soberana Avanzada TAMV
 * Roles, niveles, iniciación, estados de confianza
 */

export type TAMVTrustLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type InitiationStatus =
  | 'pre_initiation'      // No ha pasado por Sala de Origen
  | 'initiated'           // Completó ritual de entrada
  | 'citizen'             // Ciudadano activo
  | 'guardian'            // Guardián de la civilización
  | 'elder'               // Anciano / consejero
  | 'founder';            // Fundador

export type VerificationLevel =
  | 'unverified'
  | 'email_verified'
  | 'identity_verified'
  | 'institution_verified';

export interface TAMVIdentity {
  user_id: string;
  did: string;
  display_name: string;
  trust_level: TAMVTrustLevel;
  initiation_status: InitiationStatus;
  verification_level: VerificationLevel;
  reputation_score: number;
  xr_time_minutes: number;
  worlds_visited: number;
  missions_completed: number;
  roles: string[];
  badges: string[];
  created_at: string;
}

/**
 * Calculate trust level from profile metrics
 */
export function calculateTrustLevel(profile: {
  reputation_score: number;
  missions_completed: number;
  xr_time_minutes: number;
  worlds_visited: number;
}): TAMVTrustLevel {
  const { reputation_score, missions_completed, xr_time_minutes, worlds_visited } = profile;

  if (reputation_score >= 90 && missions_completed >= 50) return 5;
  if (reputation_score >= 75 && missions_completed >= 30) return 4;
  if (reputation_score >= 50 && missions_completed >= 15) return 3;
  if (reputation_score >= 25 && missions_completed >= 5) return 2;
  if (xr_time_minutes >= 60 || worlds_visited >= 3) return 1;
  return 0;
}

/**
 * Determine initiation status
 */
export function getInitiationStatus(profile: {
  onboarding_completed: boolean;
  trust_level: number;
  missions_completed: number;
}): InitiationStatus {
  if (!profile.onboarding_completed) return 'pre_initiation';
  if (profile.trust_level >= 5) return 'elder';
  if (profile.trust_level >= 3) return 'guardian';
  if (profile.trust_level >= 1) return 'citizen';
  return 'initiated';
}

/**
 * Check if user can access a district
 */
export function canAccessDistrict(
  userTrustLevel: TAMVTrustLevel,
  requiredTrustLevel: number
): boolean {
  return userTrustLevel >= requiredTrustLevel;
}

/**
 * Generate DID for TAMV user
 */
export function generateDID(userId: string): string {
  return `did:tamv:${userId}`;
}

/**
 * Get trust level label in Spanish
 */
export function getTrustLevelLabel(level: TAMVTrustLevel): string {
  const labels: Record<TAMVTrustLevel, string> = {
    0: 'Visitante',
    1: 'Iniciado',
    2: 'Ciudadano',
    3: 'Guardián',
    4: 'Anciano',
    5: 'Fundador',
  };
  return labels[level];
}
