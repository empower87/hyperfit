// import { MRV_RANK } from "~/constants/prioritizeRanks";
import { LOWER_MUSCLES } from "~/constants/workoutSplits";
import {
  MusclePriorityType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

const getLowerPosition = (list: MusclePriorityType[]) => {
  let priority = [0, 0];

  for (let i = 0; i < list.length; i++) {
    if (list[i].volume_landmark === "MRV") {
      let muscle = list[i].muscle;

      if (LOWER_MUSCLES.includes(muscle)) {
        if (i === 0 && muscle !== "calves") {
          priority[0] = 1;
          priority[1]++;
        } else if (i === 1 && muscle !== "calves") {
          if (priority[0] > 0) {
            priority[0]++;
          }
          priority[1]++;
        } else {
          priority[1]++;
        }
      }
    } else {
      break;
    }
  }

  // 4 = MAX_MRV       5
  // 3 = FULL_MRV      4
  // 2, 2 = FULL_MRV   4
  // 1, 2 = MRV        3
  // 0, 2 = LOW_MRV    2
  // 1, 1 = LOW_MRV    2
  // 0, 1 = MEV        2
  // 0 = MV            1

  switch (priority[1]) {
    case 4:
      return "MAX_MRV";
    case 3:
      return "FULL_MRV";
    case 2:
      if (priority[0] === 2) {
        return "FULL_MRV";
      } else if (priority[0] === 1) {
        return "MRV";
      } else {
        return "LOW_MRV";
      }
    case 1:
      if (priority[0] === 1) {
        return "LOW_MRV";
      } else {
        return "MEV";
      }
    default:
      return "MV";
  }
};

export type SessionSplitTESTType =
  | "upper"
  | "lower"
  | "full"
  | "push"
  | "pull"
  | "off";

export const getTrainingSplit = (
  list: MusclePriorityType[],
  totalWeeklySessions: number,
  totalDoubleSessions: number
): [SplitType, SplitType][] => {
  const sessions = totalWeeklySessions + totalDoubleSessions;
  const lowerRank = getLowerPosition(list);

  switch (sessions) {
    case 3:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["full", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["full", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["full", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
          ];
      }
    case 4:
      if (totalWeeklySessions === 3) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
              ["lower", "upper"],
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["full", "off"],
          ];
        case "FULL_MRV":
          return [
            ["off", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["full", "off"],
          ];
        case "MRV":
          return [
            ["off", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["full", "off"],
          ];
        case "LOW_MRV":
          return [
            ["off", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["full", "off"],
          ];
        case "MEV":
          return [
            ["off", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["upper", "off"],
          ];
        default:
          return [
            ["off", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["off", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["upper", "off"],
          ];
      }
    case 5:
      if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["off", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["off", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["upper", "lower"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "full"],
              ["lower", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["full", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["full", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["full", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      } else if (totalWeeklySessions === 3) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["upper", "lower"],
              ["lower", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["upper", "lower"],
              ["lower", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["lower", "off"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["lower", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["full", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
      }
    case 6:
      if (totalWeeklySessions === 3) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      } else if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "lower"],
              ["full", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "lower"],
              ["full", "off"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      } else if (totalWeeklySessions === 5) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["full", "off"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["full", "off"],
              ["upper", "lower"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "off"],
            ["lower", "off"],
            ["upper", "off"],
            ["upper", "off"],
            ["full", "off"],
            ["upper", "off"],
            ["off", "off"],
          ];
      }
    case 7:
      if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "lower"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "full"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["upper", "off"],
              ["full", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["upper", "off"],
              ["full", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      } else if (totalWeeklySessions === 6) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "off"],
              ["lower", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "off"],
              ["full", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["upper", "off"],
              ["full", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["lower", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["upper", "off"],
              ["full", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["upper", "off"],
              ["upper", "off"],
              ["upper", "off"],
              ["lower", "off"],
              ["off", "off"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["full", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["full", "upper"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["full", "upper"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["upper", "off"],
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "off"],
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
      }
    case 8:
      if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "upper"],
              ["upper", "lower"],
              ["lower", "upper"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "upper"],
              ["upper", "lower"],
              ["lower", "upper"],
              ["lower", "upper"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["full", "upper"],
              ["upper", "lower"],
              ["push", "pull"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["full", "upper"],
              ["upper", "lower"],
              ["push", "pull"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          case "MEV":
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
              ["off", "off"],
              ["off", "off"],
              ["off", "off"],
            ];
        }
      } else if (totalWeeklySessions === 6) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "off"],
              ["lower", "upper"],
              ["off", "upper"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "off"],
              ["lower", "upper"],
              ["off", "upper"],
            ];
          case "MRV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "upper"],
              ["off", "upper"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["lower", "upper"],
              ["upper", "off"],
              ["lower", "upper"],
              ["off", "upper"],
            ];
          case "MEV":
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
          default:
            return [
              ["upper", "off"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "off"],
              ["lower", "off"],
              ["upper", "off"],
              ["off", "off"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["upper", "off"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "off"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
            ["off", "off"],
          ];
      }
    case 9:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["full", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "full"],
            ["lower", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "full"],
            ["lower", "upper"],
            ["off", "off"],
            ["off", "off"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "full"],
            ["off", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["upper", "pull"],
            ["upper", "push"],
            ["off", "off"],
            ["off", "off"],
          ];
      }
    case 10:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["upper", "off"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["pull", "push"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["upper", "off"],
            ["upper", "lower"],
            ["pull", "push"],
            ["upper", "lower"],
            ["upper", "off"],
            ["off", "off"],
          ];
      }
    case 11:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "off"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "off"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "off"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "off"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["push", "pull"],
            ["lower", "upper"],
            ["pull", "off"],
            ["lower", "upper"],
            ["push", "pull"],
            ["off", "pull"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["push", "pull"],
            ["lower", "upper"],
            ["pull", "off"],
            ["lower", "upper"],
            ["push", "pull"],
            ["off", "pull"],
          ];
      }

    case 12:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["off", "upper"],
          ];
        case "MEV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["off", "pull"],
          ];
        default:
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["off", "pull"],
          ];
      }
    default:
      return [];
    // throw new Error("ERROR: no case for this input");
  }
};
