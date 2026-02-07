import {
  ConstitutionalRule,
  ConstitutionalVerdict,
} from "../types/constitutional.types";
import { CognitiveIntent } from "../types/intent.types";
import { CognitiveState } from "../types/state.types";

export class ConstitutionalGate {
  constructor(private rules: ConstitutionalRule[]) {}

  evaluate(
    state: CognitiveState,
    intent: CognitiveIntent,
  ): ConstitutionalVerdict {
    for (const rule of this.rules) {
      if (!rule.evaluate(state, intent)) {
        return {
          allowed: false,
          requireHuman: true,
          reason: rule.description,
        };
      }
    }

    return {
      allowed: true,
      requireHuman: intent.scope === "eoct",
      reason: "constitutional_pass",
    };
  }
}
