/**
 * Horus™ — Sistema de Observabilidad Total TAMV
 * Logging estructurado, métricas, trazas, health checks
 */

// ── Structured Logger ──
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

export interface StructuredLog {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  context?: Record<string, unknown>;
  trace_id?: string;
}

const logBuffer: StructuredLog[] = [];
const MAX_BUFFER = 1000;

export function log(
  level: LogLevel,
  module: string,
  message: string,
  context?: Record<string, unknown>
): StructuredLog {
  const entry: StructuredLog = {
    timestamp: new Date().toISOString(),
    level,
    module,
    message,
    context,
    trace_id: crypto.randomUUID().slice(0, 8),
  };

  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER) logBuffer.shift();

  // Console output with color coding
  const prefix = `[Horus:${module}]`;
  switch (level) {
    case 'debug': console.debug(prefix, message, context || ''); break;
    case 'info': console.info(prefix, message, context || ''); break;
    case 'warn': console.warn(prefix, message, context || ''); break;
    case 'error': case 'critical': console.error(prefix, message, context || ''); break;
  }

  return entry;
}

// ── Metrics Collector ──
export interface Metric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
  labels: Record<string, string>;
}

const metrics = new Map<string, Metric[]>();

export function recordMetric(
  name: string,
  value: number,
  unit: string = 'count',
  labels: Record<string, string> = {}
): void {
  const metric: Metric = {
    name,
    value,
    unit,
    timestamp: new Date().toISOString(),
    labels,
  };

  const existing = metrics.get(name) || [];
  existing.push(metric);
  if (existing.length > 100) existing.shift();
  metrics.set(name, existing);
}

export function getMetrics(name?: string): Map<string, Metric[]> | Metric[] {
  if (name) return metrics.get(name) || [];
  return metrics;
}

// ── Performance Tracer ──
export function startTrace(operation: string): () => number {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    recordMetric(`trace_${operation}`, duration, 'ms', { operation });
    return duration;
  };
}

// ── Health Status ──
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: Record<string, { ok: boolean; latency_ms?: number; error?: string }>;
  timestamp: string;
  uptime_s: number;
}

const startTime = Date.now();

export function getHealth(): HealthStatus {
  const errorCount = logBuffer.filter(
    l => l.level === 'error' || l.level === 'critical'
  ).length;

  return {
    status: errorCount > 10 ? 'unhealthy' : errorCount > 3 ? 'degraded' : 'healthy',
    checks: {
      logger: { ok: true },
      metrics: { ok: metrics.size >= 0 },
      error_rate: { ok: errorCount < 10 },
    },
    timestamp: new Date().toISOString(),
    uptime_s: Math.floor((Date.now() - startTime) / 1000),
  };
}

// ── Log Query ──
export function queryLogs(filter: {
  level?: LogLevel;
  module?: string;
  since?: string;
  limit?: number;
}): StructuredLog[] {
  let results = [...logBuffer];

  if (filter.level) results = results.filter(l => l.level === filter.level);
  if (filter.module) results = results.filter(l => l.module === filter.module);
  if (filter.since) {
    const since = new Date(filter.since).getTime();
    results = results.filter(l => new Date(l.timestamp).getTime() >= since);
  }

  return results.slice(-(filter.limit || 50));
}
