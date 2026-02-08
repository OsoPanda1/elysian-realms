// src/constitution/constitution.bootstrap.ts

import { ConstitutionEngine } from "./constitution.engine";
import { ConstitutionPublisher } from "./constitution.publisher";
import { BookPI } from "@/core/bookpi";

/**
 * BOOTSTRAP SOBERANO DE LA CONSTITUCIÓN TAMV
 */
export async function bootstrapTAMVConstitution() {
  const bookpi = new BookPI();

  const engine = new ConstitutionEngine({
    id: "tamv-constitution",
    version: "v1.0.0",
    signer: "tamv-foundation",
  });

  const constitution = engine.getSnapshot();

  if (!engine.verifyIntegrity()) {
    throw new Error("Constitución TAMV corrupta o manipulada.");
  }

  const publisher = new ConstitutionPublisher(bookpi);
  await publisher.publish({
    constitution,
    kind: "initial",
    actorId: "bootstrap",
    reason: "Arranque inicial del kernel TAMV.",
  });

  return {
    constitutionId: constitution.id,
    version: constitution.version,
    hash: constitution.hash,
  };
}
