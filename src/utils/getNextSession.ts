import { SplitType } from "~/pages";

export const getNextSession = (
  previousSession: SplitType,
  upper: number,
  lower: number,
  push: number,
  pull: number,
  full: number,
  off: number,
  totalLower: number,
  totalPush: number,
  totalPull: number,
  previousDaysSession?: SplitType
) => {
  switch (previousSession) {
    case "upper":
      if (lower > 0) {
        // if (previousDaysSession && previousDaysSession === "lower") {
        //   if (off > 0) {
        //     return "off";
        //   } else if (full > 0) {
        //     return "full";
        //   } else if (pull > 0) {
        //     return "pull";
        //   } else if (push > 0) {
        //     return "push";
        //   } else {
        //     return "upper";
        //   }
        // } else {
        //   return "lower";
        // }
        return "lower";
      } else if (full > 0) {
        // if (previousDaysSession && previousDaysSession === "lower") {
        //   if (off > 0) {
        //     return "off";
        //   } else if (pull > 0) {
        //     return "pull";
        //   } else if (push > 0) {
        //     return "push";
        //   } else {
        //     return "full";
        //   }
        // } else {
        //   return "full";
        // }
        return "full";
      } else if (off > 0) {
        return "off";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else if (upper > 0) {
        return "upper";
      } else {
        return "off";
      }
    case "lower":
      if (upper > 0) {
        // if (previousDaysSession && previousDaysSession === "upper") {
        //   if (off > 0) {
        //     return "off";
        //   } else if (pull > 0) {
        //     return "pull";
        //   } else if (push > 0) {
        //     return "push";
        //   } else if (full > 0) {
        //     return "full";
        //   } else {
        //     return "lower";
        //   }
        // } else {
        //   return "upper";
        // }
        return "upper";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else if (off > 0) {
        return "off";
      } else if (full > 0) {
        return "full";
      } else if (lower > 0) {
        return "lower";
      } else {
        return "off";
      }
    case "push":
      if (pull > 0) {
        return "pull";
      } else if (lower > 0) {
        return "lower";
      } else if (full > 0) {
        return "full";
      } else if (upper > 0) {
        return "upper";
      } else if (off > 0) {
        return "off";
      } else {
        return "push";
      }
    case "pull":
      if (push > 0) {
        return "push";
      } else if (lower > 0) {
        return "lower";
      } else if (full > 0) {
        return "full";
      } else if (upper > 0) {
        return "upper";
      } else if (off > 0) {
        return "off";
      } else {
        return "pull";
      }
    case "full":
      if (upper > 0) {
        return "upper";
      } else if (lower > 0) {
        return "lower";
      } else if (push > 0) {
        return "push";
      } else if (pull > 0) {
        return "pull";
      } else if (off > 0) {
        return "off";
      } else {
        return "full";
      }
    default:
      // off
      if (
        lower > 0 &&
        ((totalLower >= totalPush && totalLower >= totalPull) ||
          (totalPush >= totalPull && totalPush - 1 <= totalLower) ||
          (totalPull >= totalPush && totalPull - 1 <= totalLower))
      ) {
        return "lower";
      } else if (upper > 0) {
        return "upper";
      } else if (totalPush >= totalPull && push > 0) {
        return "push";
      } else if (totalPull >= totalPush && pull > 0) {
        return "pull";
      } else if (full > 0) {
        return "full";
      } else {
        return "off";
      }
  }
};
