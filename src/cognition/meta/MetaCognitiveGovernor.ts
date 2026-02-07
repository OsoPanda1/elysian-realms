import { CognitiveIntent } from "../types/intent.types";
import { CognitiveState } from "../types/state.types";

export class MetaCognitiveGovernor {
  assess(state: CognitiveState, intents: CognitiveIntent[]) {
    const protocolPressure = state.activeProtocols.length / 5;
    const overreactionRisk =
      intents.filter(i => i.reversibility === "hard").length / 3;

    return {
      legitimacy: state.legitimacy,
      protocolPressure,
      overreactionRisk,
    };
  }

  shouldDampen(assessment: {
    legitimacy: number;
    protocolPressure: number;
    overreactionRisk: number;
  }): boolean {
    return (
      assessment.legitimacy < 0.7 ||
      assessment.protocolPressure > 0.6 ||
      assessment.overreactionRisk > 0.5
    );
  }
}
