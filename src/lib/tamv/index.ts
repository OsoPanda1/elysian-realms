/**
 * TAMV MD-X4™ — Ecosistema Civilizatorio Digital
 * Punto de entrada unificado para todos los módulos TAMV
 * 
 * Arquitectura:
 * ┌─────────────────────────────────────────────────┐
 * │                   EOCT (Centro de Mando)         │
 * ├─────────────┬──────────────┬─────────────────────┤
 * │ Anubis      │ Horus        │ Guardianías         │
 * │ (Seguridad) │ (Observab.)  │ (Watchers)          │
 * ├─────────────┼──────────────┼─────────────────────┤
 * │ Dekateotl   │ BookPI       │ MSR                 │
 * │ (Crypto)    │ (Auditoría)  │ (Blockchain)        │
 * ├─────────────┼──────────────┼─────────────────────┤
 * │ Radares     │ ID-NVIDA     │ Protocolos          │
 * │ (Vigilancia)│ (Identidad)  │ (Operación)         │
 * ├─────────────┴──────────────┴─────────────────────┤
 * │            Tenochtitlan (Modelo Civilizatorio)    │
 * └──────────────────────────────────────────────────┘
 */

// Security
export * as AnubisSentinel from './anubis-sentinel';

// Observability
export * as Horus from './horus';

// Cryptography
export * as Dekateotl from './dekateotl';

// Audit & Ledger
export * as BookPI from './bookpi';
export * as MSR from './msr-blockchain';

// Surveillance
export * as Radars from './radars';

// Watchers
export * as Guardianias from './guardianias';

// Command Center
export * as EOCT from './eoct';

// Identity
export * as IDNVIDA from './id-nvida';

// Protocols
export * as Protocolos from './protocolos';

// Civilizational Model
export * as Tenochtitlan from './tenochtitlan';

// Re-export key types
export type { BookPIAnchor, BookPIEventType } from './bookpi';
export type { SecurityIncident, SecurityLevel } from './anubis-sentinel';
export type { StructuredLog, LogLevel, HealthStatus } from './horus';
export type { RadarReading, RadarType, AlertLevel } from './radars';
export type { Guardian, GuardianStatus } from './guardianias';
export type { EOCTState, EOCTSignal, EOCTLevel, ProtocolType } from './eoct';
export type { TAMVIdentity, TAMVTrustLevel, InitiationStatus } from './id-nvida';
export type { ProtocolExecution, ProtocolState } from './protocolos';
export type { TAMVCity, District, FederationNode, DistrictType } from './tenochtitlan';
