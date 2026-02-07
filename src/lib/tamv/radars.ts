/**
 * Radares TAMV™ — Sistemas de Vigilancia Civilizatoria
 * Quetzalcóatl (tráfico XR), Ojo de Ra (ataques), Gemelos MOS (economía)
 */

import { log, recordMetric } from './horus';
import { anchorEvent } from './bookpi';

export type RadarType = 'quetzalcoatl' | 'ojo_de_ra' | 'gemelos_mos';
export type AlertLevel = 'nominal' | 'elevated' | 'warning' | 'critical';

export interface RadarReading {
  radar: RadarType;
  timestamp: string;
  alert_level: AlertLevel;
  metrics: Record<string, number>;
  anomalies: string[];
}

// ── Quetzalcóatl: XR Traffic Radar ──
export function scanXRTraffic(data: {
  active_users: number;
  latency_ms: number;
  jitter_ms: number;
  packet_loss_pct: number;
}): RadarReading {
  const anomalies: string[] = [];
  let alertLevel: AlertLevel = 'nominal';

  if (data.latency_ms > 200) { anomalies.push('high_latency'); alertLevel = 'elevated'; }
  if (data.jitter_ms > 50) { anomalies.push('high_jitter'); alertLevel = 'warning'; }
  if (data.packet_loss_pct > 5) { anomalies.push('packet_loss'); alertLevel = 'critical'; }

  const reading: RadarReading = {
    radar: 'quetzalcoatl',
    timestamp: new Date().toISOString(),
    alert_level: alertLevel,
    metrics: data,
    anomalies,
  };

  recordMetric('radar_quetzalcoatl_latency', data.latency_ms, 'ms');
  recordMetric('radar_quetzalcoatl_users', data.active_users, 'count');

  if (anomalies.length > 0) {
    log('warn', 'Radar:Quetzalcóatl', `Anomalías detectadas: ${anomalies.join(', ')}`, data);
  }

  return reading;
}

// ── Ojo de Ra: Attack Detection Radar ──
export function scanThreats(data: {
  failed_auth_attempts: number;
  suspicious_ips: number;
  injection_attempts: number;
  brute_force_detected: boolean;
}): RadarReading {
  const anomalies: string[] = [];
  let alertLevel: AlertLevel = 'nominal';

  if (data.failed_auth_attempts > 10) { anomalies.push('auth_spike'); alertLevel = 'elevated'; }
  if (data.suspicious_ips > 5) { anomalies.push('suspicious_traffic'); alertLevel = 'warning'; }
  if (data.injection_attempts > 0) { anomalies.push('injection_attempt'); alertLevel = 'critical'; }
  if (data.brute_force_detected) { anomalies.push('brute_force'); alertLevel = 'critical'; }

  const reading: RadarReading = {
    radar: 'ojo_de_ra',
    timestamp: new Date().toISOString(),
    alert_level: alertLevel,
    metrics: {
      failed_auth: data.failed_auth_attempts,
      suspicious_ips: data.suspicious_ips,
      injections: data.injection_attempts,
    },
    anomalies,
  };

  recordMetric('radar_ojo_de_ra_threats', anomalies.length, 'count');

  if (alertLevel === 'critical') {
    log('error', 'Radar:OjoDeRa', 'ALERTA CRÍTICA DE SEGURIDAD', { anomalies, data });
  }

  return reading;
}

// ── Gemelos MOS: Economy Radar ──
export function scanEconomy(data: {
  transaction_volume: number;
  avg_transaction_amount: number;
  suspicious_transactions: number;
  whale_movements: number;
}): RadarReading {
  const anomalies: string[] = [];
  let alertLevel: AlertLevel = 'nominal';

  if (data.suspicious_transactions > 3) { anomalies.push('suspicious_txns'); alertLevel = 'warning'; }
  if (data.whale_movements > 2) { anomalies.push('whale_activity'); alertLevel = 'elevated'; }
  if (data.avg_transaction_amount > 10000) { anomalies.push('high_value_spike'); alertLevel = 'warning'; }

  const reading: RadarReading = {
    radar: 'gemelos_mos',
    timestamp: new Date().toISOString(),
    alert_level: alertLevel,
    metrics: data,
    anomalies,
  };

  recordMetric('radar_gemelos_volume', data.transaction_volume, 'count');
  recordMetric('radar_gemelos_avg', data.avg_transaction_amount, 'TAU');

  return reading;
}

// ── Unified Scan ──
export async function fullRadarScan(
  userId: string,
  xrData: Parameters<typeof scanXRTraffic>[0],
  threatData: Parameters<typeof scanThreats>[0],
  econData: Parameters<typeof scanEconomy>[0]
): Promise<RadarReading[]> {
  const readings = [
    scanXRTraffic(xrData),
    scanThreats(threatData),
    scanEconomy(econData),
  ];

  const critical = readings.filter(r => r.alert_level === 'critical');
  if (critical.length > 0) {
    await anchorEvent('SECURITY_EVENT', userId, {
      type: 'RADAR_CRITICAL_ALERT',
      radars: critical.map(r => r.radar),
      anomalies: critical.flatMap(r => r.anomalies),
    }, 'RADAR_ALERT');
  }

  return readings;
}
