/**
 * CognitiveMachine — Motor cognitivo TAMV (wrapper de alto nivel).
 * Integra guardianías, BookPI y estado cognitivo.
 */

import {
  GuardianiaContext,
  ManualProtocolTrigger,
} from "./guardianias.types";
import { CognitiveState } from "@/cognition/cognition.types";
import { BookPI, BookPIEventPayload } from "@/core/bookpi";

export class CognitiveMachine {
  private state: CognitiveState;
  private readonly bookpi?: BookPI;

  constructor(gate?: any, bookpi?: BookPI) {
    this.bookpi = bookpi;
    this.state = {
      mood: "calm",
      perceivedRisk: 0,
      activeProtocols: [],
      lastUpdate: Date.now(),
    };
  }

  getState(): CognitiveState {
    return { ...this.state };
  }

  updateState(partial: Partial<CognitiveState>): CognitiveState {
    this.state = {
      ...this.state,
      ...partial,
      lastUpdate: Date.now(),
    };

    if (this.bookpi && this.state.perceivedRisk > 0.7) {
      this.bookpi.anchorEvent({
        domain: "cognition",
        type: "high_risk_state",
        level: "high",
        data: {
          mood: this.state.mood,
          perceivedRisk: this.state.perceivedRisk,
          activeProtocols: this.state.activeProtocols,
        },
        candidateForLedger: this.state.perceivedRisk > 0.9,
      });
    }

    return this.state;
  }
}

export { CognitiveMachine as default };
