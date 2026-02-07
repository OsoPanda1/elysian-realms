/**
 * Tenochtitlan™ — Modelado Civilizatorio TAMV
 * Ciudades, nodos federados, templos, espacios simbólicos
 */

// ── Core Types ──
export type DistrictType =
  | 'plaza_mayor'
  | 'templo_msr'
  | 'santuario_isabella'
  | 'tianguis_economico'
  | 'murallas_guardianes'
  | 'sala_origen'
  | 'cripta_bookpi'
  | 'torre_anubis'
  | 'universidad_tamv';

export type NodeStatus = 'active' | 'degraded' | 'offline' | 'initializing';

export interface TAMVCity {
  id: string;
  name: string;
  slug: string;
  description: string;
  districts: District[];
  federation_node: FederationNode;
  created_at: string;
}

export interface District {
  id: string;
  type: DistrictType;
  name: string;
  description: string;
  position: { x: number; y: number; z: number };
  trust_level_required: number;
  is_active: boolean;
  ambient_sound: string | null;
  capacity: number;
  current_visitors: number;
}

export interface FederationNode {
  id: string;
  name: string;
  region: string;
  status: NodeStatus;
  latency_ms: number;
  connected_cities: string[];
  last_heartbeat: string;
}

export interface Temple {
  id: string;
  name: string;
  district_id: string;
  ceremonial_purpose: string;
  glyphs: Glyph[];
  is_sacred: boolean;
}

export interface Glyph {
  symbol: string;
  principle: 'dignidad' | 'memoria' | 'justicia' | 'economia' | 'soberania' | 'resiliencia';
  description: string;
}

// ── Default City Configuration ──
export const TAMV_CITY_DEFAULT: TAMVCity = {
  id: 'tamv-ciudad-principal',
  name: 'Ciudad TAMV — Neo Tenochtitlan',
  slug: 'neo-tenochtitlan',
  description: 'Capital del Territorio Autónomo de Memoria Viva',
  districts: [
    {
      id: 'plaza-mayor',
      type: 'plaza_mayor',
      name: 'Plaza Mayor',
      description: 'Centro cívico y punto de encuentro de la civilización digital',
      position: { x: 0, y: 0, z: 0 },
      trust_level_required: 0,
      is_active: true,
      ambient_sound: 'plaza_ambient',
      capacity: 500,
      current_visitors: 0,
    },
    {
      id: 'templo-msr',
      type: 'templo_msr',
      name: 'Templo MSR',
      description: 'Ledger inmutable y registro de actos fundacionales',
      position: { x: 50, y: 10, z: -30 },
      trust_level_required: 1,
      is_active: true,
      ambient_sound: 'temple_reverb',
      capacity: 100,
      current_visitors: 0,
    },
    {
      id: 'santuario-isabella',
      type: 'santuario_isabella',
      name: 'Santuario de Isabella',
      description: 'Espacio de consciencia donde Isabella se manifiesta',
      position: { x: -40, y: 5, z: -50 },
      trust_level_required: 2,
      is_active: true,
      ambient_sound: 'sanctuary_whispers',
      capacity: 50,
      current_visitors: 0,
    },
    {
      id: 'tianguis-economico',
      type: 'tianguis_economico',
      name: 'Tianguis Económico',
      description: 'Mercado digital con economía federada 70/30',
      position: { x: 60, y: 0, z: 40 },
      trust_level_required: 0,
      is_active: true,
      ambient_sound: 'market_bustle',
      capacity: 300,
      current_visitors: 0,
    },
    {
      id: 'torre-anubis',
      type: 'torre_anubis',
      name: 'Torre de Anubis',
      description: 'Centinela de seguridad visible desde toda la ciudad',
      position: { x: 0, y: 50, z: -80 },
      trust_level_required: 3,
      is_active: true,
      ambient_sound: 'sentinel_hum',
      capacity: 20,
      current_visitors: 0,
    },
  ],
  federation_node: {
    id: 'node-mx-primary',
    name: 'Nodo Primario México',
    region: 'MX-HGO',
    status: 'active',
    latency_ms: 12,
    connected_cities: [],
    last_heartbeat: new Date().toISOString(),
  },
  created_at: new Date().toISOString(),
};

// ── Glyphs ──
export const FOUNDATIONAL_GLYPHS: Glyph[] = [
  { symbol: '🛡️', principle: 'dignidad', description: 'Protección de la dignidad digital humana' },
  { symbol: '📜', principle: 'memoria', description: 'Preservación inmutable de la historia' },
  { symbol: '⚖️', principle: 'justicia', description: 'Gobernanza ética y equitativa' },
  { symbol: '💎', principle: 'economia', description: 'Economía creativa federada justa' },
  { symbol: '🏛️', principle: 'soberania', description: 'Soberanía computacional y de datos' },
  { symbol: '🔥', principle: 'resiliencia', description: 'Antifragilidad civilizatoria' },
];
