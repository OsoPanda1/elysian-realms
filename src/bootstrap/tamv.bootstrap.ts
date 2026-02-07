// src/bootstrap/bootstrap.tamv.ts

import { BookPI } from "@/core/bookpi";
import { ConstitutionEngine } from "@/constitution/constitution.engine";
import { ConstitutionPublisher } from "@/constitution/constitution.publisher";
import { ConstitutionalGate } from "@/constitution/constitutional.gate";
import { CognitiveMachine } from "@/cognition/cognition.machine";
import { GuardianiasEngine } from "@/guardianias/guardianias.engine";

export type BootMode = "normal" | "safe" | "diagnostic";

export interface TAMVKernel {
  mode: BootMode;
  bootTs: number;

  bookpi: BookPI;
  constitutionEngine: ConstitutionEngine;
  gate: ConstitutionalGate;
  cognition: CognitiveMachine;
  guardianias: GuardianiasEngine;

  // hooks para futuros subsistemas
  // msr?: MSRClient;
  // anubis?: AnubisSentinel;
  // horus?: HorusObservability;
}

interface BootstrapOptions {
  mode?: BootMode;
  actorId?: string;
  reason?: string;
}

/**
 * Bootstrap civilizatorio de TAMV.
 * Levanta:
 *  - BookPI (libro de auditoría ética)
 *  - Constitución y gate
 *  - Máquina cognitiva
 *  - Guardianías principales
 * Deja todo listo para integrar MSR, radares, EOCT, etc.
 */
export async function bootstrapTAMV(
  options: BootstrapOptions = {},
): Promise<TAMVKernel> {
  const mode: BootMode = options.mode ?? "normal";
  const bootTs = Date.now();
  const actorId = options.actorId ?? "bootstrap";
  const reason =
    options.reason ??
    (mode === "safe"
      ? "Arranque en modo seguro tras incidente."
      : "Arranque normal del kernel TAMV.");

  // 1) BookPI · Libro civilizatorio
  const bookpi = new BookPI({
    hashAlgo: "SHA3-512",
    defaultAuditLevel: "high",
    redactSecrets: true,
    jurisdiction: "MX",
    dataClassification: "civilizatorio",
    contextTag: "tamv-mdx4",
    originCity: "Real-del-Monte",
    originCountry: "MX",
  });

  // 2) Constitución TAMV · generación y verificación
  const constitutionEngine = new ConstitutionEngine({
    id: "tamv-constitution",
    version: "v1.0.0",
    signer: "tamv-foundation",
  });

  const constitution = constitutionEngine.getSnapshot();

  if (!constitutionEngine.verifyIntegrity()) {
    // Si la Constitución está comprometida, no levantamos el mundo.
    bookpi.anchorEvent({
      domain: "constitution",
      type: "integrity_failure",
      level: "critical",
      data: {
        bootMode: mode,
        reason: "Hash o firma constitucional no válidos.",
      },
      candidateForLedger: true,
    });

    throw new Error(
      "Constitución TAMV corrupta o manipulada. Abortando bootstrap.",
    );
  }

  // 3) Publicación constitucional (auditada)
  const publisher = new ConstitutionPublisher(bookpi);
  await publisher.publish({
    constitution,
    kind: mode === "safe" ? "rollback" : "initial",
    actorId,
    reason,
    previousVersion: undefined,
  });

  // 4) Gate constitucional
  const gate = new ConstitutionalGate(constitution);

  // 5) Máquina cognitiva (Isabella kernel)
  const cognition = new CognitiveMachine(gate, bookpi);

  // 6) Guardianías principales
  const guardianias = new GuardianiasEngine(bookpi, {
    id: "guardiania-principal",
    name: "Guardianía Principal TAMV",
    riskAlertThreshold: 0.6,
    riskEscalateThreshold: 0.85,
    minDurationMsForEscalation: mode === "diagnostic" ? 5_000 : 20_000,
  });

  // 7) Anchor de arranque del kernel
  bookpi.anchorEvent({
    domain: "system",
    type: "tamv_kernel_bootstrap",
    level: mode === "safe" ? "critical" : "high",
    data: {
      mode,
      bootTs,
      actorId,
      reason,
      constitutionId: constitution.id,
      constitutionVersion: constitution.version,
      guardianiaId: "guardiania-principal",
    },
    candidateForLedger: true,
  });

  return {
    mode,
    bootTs,
    bookpi,
    constitutionEngine,
    gate,
    cognition,
    guardianias,
  };
}
