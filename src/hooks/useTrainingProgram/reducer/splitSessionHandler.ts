import { isKey } from "~/utils/typeHelpers/isKey";
import {
  SessionSplitType,
  SplitSessionsNameType,
  SplitSessionsType,
} from "./trainingProgramReducer";

const getPotentialSplits = (
  splitType: SessionSplitType
): SplitSessionsNameType[] => {
  switch (splitType) {
    case "arms":
      return ["BRO", "CUS"];
    case "back":
      return ["BRO", "CUS"];
    case "chest":
      return ["BRO", "CUS"];
    case "legs":
      return ["PPL", "PPLUL", "BRO", "CUS"];
    case "shoulders":
      return ["BRO", "CUS"];
    case "push":
      return ["PPL", "PPLUL", "OPT", "CUS"];
    case "pull":
      return ["PPL", "PPLUL", "OPT", "CUS"];
    case "upper":
      return ["UL", "OPT", "PPLUL", "CUS"];
    case "lower":
      return ["UL", "OPT", "PPLUL", "CUS"];
    case "full":
      return ["FB", "OPT", "CUS"];
    default:
      return [];
  }
};

export const determineSplitHandler = (splitType: SessionSplitType[]) => {
  let splits: SplitSessionsNameType[] = [];

  for (let i = 0; i < splitType.length; i++) {
    const potential = getPotentialSplits(splitType[i]);
    if (i === 0) {
      splits = potential;
    } else {
      splits = splits.filter((split) => potential.includes(split));
    }
  }
  return splits;
};

export const redistributeSessionsIntoNewSplit = (
  split: SplitSessionsNameType,
  splits: SessionSplitType[]
): SplitSessionsType => {
  switch (split) {
    case "BRO":
      const BRO_SPLIT = {
        arms: 0,
        shoulders: 0,
        back: 0,
        chest: 0,
        legs: 0,
      };

      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(BRO_SPLIT, key);
        if (validKey) {
          BRO_SPLIT[key] = BRO_SPLIT[key] + 1;
        }
      }
      return { split: "BRO", sessions: BRO_SPLIT };
    case "PPL":
      const PPL_SPLIT = {
        push: 0,
        pull: 0,
        legs: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(PPL_SPLIT, key);
        if (validKey) {
          PPL_SPLIT[key] = PPL_SPLIT[key] + 1;
        }
      }
      return { split: "PPL", sessions: PPL_SPLIT };
    case "PPLUL":
      const PPLUL_SPLIT = {
        push: 0,
        pull: 0,
        legs: 0,
        upper: 0,
        lower: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(PPLUL_SPLIT, key);
        if (validKey) {
          PPLUL_SPLIT[key] = PPLUL_SPLIT[key] + 1;
        }
      }
      return { split: "PPLUL", sessions: PPLUL_SPLIT };
    case "UL":
      const UL_SPLIT = {
        upper: 0,
        lower: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(UL_SPLIT, key);
        if (validKey) {
          UL_SPLIT[key] = UL_SPLIT[key] + 1;
        }
      }
      return { split: "UL", sessions: UL_SPLIT };
    case "FB":
      const FB_SPLIT = {
        full: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(FB_SPLIT, key);
        if (validKey) {
          FB_SPLIT[key] = FB_SPLIT[key] + 1;
        }
      }
      return { split: "FB", sessions: FB_SPLIT };
    case "OPT":
      const OPT_SPLIT = {
        upper: 0,
        lower: 0,
        push: 0,
        pull: 0,
        full: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i];
        const validKey = isKey(OPT_SPLIT, key);
        if (validKey) {
          OPT_SPLIT[key] = OPT_SPLIT[key] + 1;
        }
      }
      return { split: "OPT", sessions: OPT_SPLIT };
    default:
      const CUS_SPLIT = {
        upper: 0,
        lower: 0,
        push: 0,
        pull: 0,
        legs: 0,
        full: 0,
        back: 0,
        chest: 0,
        arms: 0,
        shoulders: 0,
      };
      for (let i = 0; i < splits.length; i++) {
        const key = splits[i] as keyof typeof CUS_SPLIT;
        CUS_SPLIT[key] = CUS_SPLIT[key] + 1;
      }
      return { split: "CUS", sessions: CUS_SPLIT };
  }
};
