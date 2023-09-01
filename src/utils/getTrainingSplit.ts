import { MRV_RANK } from "~/constants/prioritizeRanks";
import { LOWER_MUSCLES } from "~/constants/workoutSplits";
import { MusclePriorityType } from "~/pages";

const getLowerPosition = (list: MusclePriorityType[]) => {
  let priority = [0, 0];

  for (let i = 0; i < list.length; i++) {
    if (i < MRV_RANK) {
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
  | "none";

export const getTrainingSplit = (
  list: MusclePriorityType[],
  totalWeeklySessions: number,
  totalDoubleSessions: number
): SessionSplitTESTType[][] => {
  const sessions = totalWeeklySessions + totalDoubleSessions;
  const lowerRank = getLowerPosition(list);

  switch (sessions) {
    case 3:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["full", "none"],
            ["upper", "none"],
          ];
      }
    case 4:
      if (totalWeeklySessions === 3) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "full"],
              ["lower", "none"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "full"],
              ["lower", "none"],
            ];
          case "MRV":
            return [
              ["lower", "none"],
              ["upper", "full"],
              ["upper", "none"],
            ];
          case "LOW_MRV":
            return [
              ["lower", "none"],
              ["upper", "full"],
              ["upper", "none"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "full"],
              ["upper", "none"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["full", "none"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["full", "none"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["full", "none"],
            ["upper", "none"],
            ["upper", "none"],
          ];
      }
    case 5:
      if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "lower"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "lower"],
            ];
          case "MRV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "full"],
              ["lower", "none"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["full", "none"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["full", "none"],
            ];
          default:
            return [
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["full", "none"],
            ];
        }
      } else if (totalWeeklySessions === 3) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "lower"],
              ["lower", "full"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "lower"],
              ["lower", "full"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["lower", "none"],
              ["upper", "full"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "full"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["lower", "none"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["full", "none"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
            ["upper", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
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
            ];
          case "FULL_MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["lower", "upper"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
          case "MEV":
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
          default:
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["upper", "full"],
            ];
        }
      } else if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "lower"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "lower"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "lower"],
              ["full", "none"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "lower"],
              ["full", "none"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "lower"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "lower"],
            ];
        }
      } else if (totalWeeklySessions === 5) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "none"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "none"],
            ];
          case "MRV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["full", "none"],
              ["upper", "lower"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["full", "none"],
              ["upper", "lower"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "upper"],
            ];
          default:
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "upper"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["lower", "none"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["full", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["lower", "none"],
            ["upper", "none"],
            ["upper", "none"],
            ["full", "none"],
            ["upper", "none"],
          ];
      }
    case 7:
      if (totalWeeklySessions === 4) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "lower"],
              ["lower", "upper"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "full"],
              ["lower", "upper"],
            ];
          case "MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["upper", "none"],
              ["full", "upper"],
            ];
          case "LOW_MRV":
            return [
              ["lower", "upper"],
              ["lower", "upper"],
              ["upper", "none"],
              ["full", "upper"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
            ];
        }
      } else if (totalWeeklySessions === 6) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "none"],
              ["lower", "none"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "none"],
              ["full", "none"],
            ];
          case "MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["upper", "none"],
              ["full", "none"],
              ["upper", "none"],
            ];
          case "LOW_MRV":
            return [
              ["lower", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["upper", "none"],
              ["full", "none"],
              ["upper", "none"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "none"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["upper", "none"],
              ["upper", "none"],
              ["upper", "none"],
              ["lower", "none"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "none"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["full", "none"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["full", "upper"],
            ["upper", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["full", "upper"],
            ["upper", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["upper", "none"],
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
            ];
          case "FULL_MRV":
            return [
              ["lower", "upper"],
              ["upper", "lower"],
              ["lower", "upper"],
              ["lower", "upper"],
            ];
          case "MRV":
            return [
              ["upper", "lower"],
              ["full", "upper"],
              ["upper", "lower"],
              ["push", "pull"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "lower"],
              ["full", "upper"],
              ["upper", "lower"],
              ["push", "pull"],
            ];
          case "MEV":
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
            ];
          default:
            return [
              ["push", "pull"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "full"],
            ];
        }
      } else if (totalWeeklySessions === 6) {
        switch (lowerRank) {
          case "MAX_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "none"],
              ["lower", "upper"],
            ];
          case "FULL_MRV":
            return [
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "none"],
              ["lower", "upper"],
            ];
          case "MRV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "upper"],
            ];
          case "LOW_MRV":
            return [
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
              ["lower", "upper"],
              ["upper", "none"],
              ["lower", "upper"],
            ];
          case "MEV":
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
            ];
          default:
            return [
              ["upper", "none"],
              ["upper", "lower"],
              ["push", "pull"],
              ["upper", "none"],
              ["lower", "none"],
              ["upper", "none"],
            ];
        }
      }
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "none"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "none"],
          ];
        case "MEV":
          return [
            ["upper", "none"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "lower"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "none"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "lower"],
            ["upper", "none"],
          ];
      }
    case 9:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["full", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "full"],
            ["lower", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "full"],
            ["lower", "upper"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["push", "pull"],
            ["upper", "full"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["upper", "pull"],
            ["upper", "push"],
          ];
      }
    case 10:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["upper", "none"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["pull", "push"],
            ["upper", "lower"],
            ["upper", "none"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["upper", "none"],
            ["upper", "lower"],
            ["pull", "push"],
            ["upper", "lower"],
            ["upper", "none"],
          ];
      }
    case 11:
      switch (lowerRank) {
        case "MAX_MRV":
          return [
            ["lower", "none"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "FULL_MRV":
          return [
            ["lower", "none"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "none"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "none"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MEV":
          return [
            ["upper", "lower"],
            ["push", "pull"],
            ["lower", "upper"],
            ["pull", "none"],
            ["lower", "upper"],
            ["push", "pull"],
          ];
        default:
          return [
            ["upper", "lower"],
            ["push", "pull"],
            ["lower", "upper"],
            ["pull", "none"],
            ["lower", "upper"],
            ["push", "pull"],
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
          ];
        case "FULL_MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "LOW_MRV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["lower", "upper"],
          ];
        case "MEV":
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
          ];
        default:
          return [
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
            ["lower", "upper"],
            ["push", "pull"],
          ];
      }
    default:
      throw new Error("ERROR: no case for this input");
  }
};
