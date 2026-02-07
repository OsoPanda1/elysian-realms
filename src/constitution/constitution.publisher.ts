import { TAMVConstitution } from "./constitution.types";
import { BookPI } from "@/core/bookpi";

export class ConstitutionPublisher {
  constructor(private bookpi: BookPI) {}

  async publish(constitution: TAMVConstitution) {
    // 1️⃣ Anchor ético (BookPI)
    const anchor = this.bookpi.anchorEvent({
      domain: "constitution",
      type: "constitution_created",
      level: "critical",
      data: {
        id: constitution.id,
        version: constitution.version,
        hash: constitution.hash,
        principles: constitution.principles,
      },
      candidateForLedger: true,
    });

    // 2️⃣ Registro MSR (blockchain)
    // (simulado aquí, pero el hash es real)
    const msrPayload = {
      constitutionId: constitution.id,
      version: constitution.version,
      hash: constitution.hash,
      bookpiAnchorId: anchor.id,
      ts: Date.now(),
    };

    //  aquí entra el módulo MSR real
    // msr.register(msrPayload)

    return {
      anchored: true,
      ledgerCandidate: true,
      msrPayload,
    };
  }
}
