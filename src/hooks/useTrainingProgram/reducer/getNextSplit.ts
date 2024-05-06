import { getNextSplitBRO } from "./splitSessionsHandler(ORIGINAL)";
import { SplitSessionsType } from "./trainingProgramReducer";

export const getNextSplit = (
  lastIn: string,
  split_sessions: SplitSessionsType,
  map: Map<string, number>
) => {
  switch (split_sessions.split) {
    case "OPT":
    // return getNextSplitOPT(lastIn, split_sessions.sessions);
    case "PPL":
    // return getNextSplitPPL(lastIn, split_sessions.sessions);
    case "PPLUL":
    // return getNextSplitPPLUL(lastIn, split_sessions.sessions);
    case "UL":
      // return getNextSplitUL(lastIn, split_sessions.sessions, "lower");
      return getNextSplitBRO(lastIn);
    case "BRO":
      const counter = { ...split_sessions.sessions };
      return getNextSplitBRO(lastIn);
    default:
      return [];
  }
};
