import { SplitSessionsNameType } from "../reducer/trainingProgramReducer";
import {
  distributeSessionsIntoSplits,
  SplitMaxes,
} from "../utils/split_sessions/distributeSessionsIntoSplits";

describe("distributeSessionsIntoSplits", () => {
  it("should return sessions equal to total_sessions given", () => {
    const split: SplitSessionsNameType = "OPT";
    const total_sessions = 4;
    const freq_limits: SplitMaxes = {
      push: [5, 2],
      pull: [4, 1],
      legs: [4, 3],
    };

    const split_sessions = distributeSessionsIntoSplits(
      split,
      total_sessions,
      freq_limits
    );
    const total = Object.values(split_sessions.sessions).reduce(
      (a, b) => a + b,
      0
    );
    expect(total === total_sessions);
  });
});
