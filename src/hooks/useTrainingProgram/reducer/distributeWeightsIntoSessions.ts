const freqLimitsHandler = (push: number[], pull: number[], legs: number[]) => {
  const pushAvg = Math.round(push[0] + push[1] / 2);
  const pullAvg = Math.round(pull[0] + pull[1] / 2);
  const legsAvg = Math.round(legs[0] + legs[1] / 2);

  const upperMin = Math.round(push[0] + pull[0] / 2);
  const upperMax = Math.round(push[1] + pull[1] / 2);
  return {
    push: {
      min: push[0],
      max: push[1],
      avg: pushAvg,
    },
    pull: {
      min: pull[0],
      max: pull[1],
      avg: pullAvg,
    },
    legs: {
      min: legs[0],
      max: legs[1],
      avg: legsAvg,
    },
    upper: {
      min: upperMin,
      max: upperMax,
      avg: Math.round(upperMin + upperMax / 2),
    },
  };
};

type MaxSessionsPerSplit = {
  push: {
    min: number;
    max: number;
    avg: number;
  };
  pull: {
    min: number;
    max: number;
    avg: number;
  };
  legs: {
    min: number;
    max: number;
    avg: number;
  };
  upper: {
    min: number;
    max: number;
    avg: number;
  };
};

function distributeTotalSessionsIntoSplits(
  totalSessions: number,
  maxFullSessions: number,
  minMaxPerSplit: MaxSessionsPerSplit,
  prioritizedSplits: ("push" | "pull" | "legs")[]
): { push: number; pull: number; legs: number; upper: number; full: number } {
  const distributedSessions = {
    push: 0,
    pull: 0,
    legs: 0,
    upper: 0,
    full: 0,
  };

  // Sort the prioritized splits based on the minimum required sessions
  const sortedPrioritizedSplits = prioritizedSplits.sort(
    (a, b) => minMaxPerSplit[a].min - minMaxPerSplit[b].min
  );

  // Assign the minimum required sessions for each prioritized split
  for (const split of sortedPrioritizedSplits) {
    distributedSessions[split] = minMaxPerSplit[split].min;
    totalSessions -= minMaxPerSplit[split].min;
  }

  // Assign any remaining sessions to the prioritized splits, up to their maximum allowed sessions
  while (totalSessions > 0) {
    for (const split of sortedPrioritizedSplits) {
      if (
        distributedSessions[split] < minMaxPerSplit[split].max &&
        totalSessions > 0
      ) {
        distributedSessions[split]++;
        totalSessions--;
      }
    }
  }

  // Assign any remaining sessions to full sessions, up to the maximum allowed
  distributedSessions.full = Math.min(totalSessions, maxFullSessions);

  // Assign any remaining sessions to upper sessions
  distributedSessions.upper = totalSessions - distributedSessions.full;

  // Update push and pull sessions based on upper and full sessions
  distributedSessions.push +=
    distributedSessions.upper + distributedSessions.full;
  distributedSessions.pull +=
    distributedSessions.upper + distributedSessions.full;
  distributedSessions.legs += distributedSessions.full;

  return distributedSessions;
}

export const distributeWeightsIntoSessions = (
  total_sessions: number,
  limits: {
    push: number[];
    pull: number[];
    legs: number[];
  }
) => {
  const weight = {
    push: 29.02,
    pull: 32.14,
    legs: 25.14,
  };
  const weight_order = Object.keys(limits).sort(
    (a, b) =>
      limits[b as keyof typeof weight][1] - limits[a as keyof typeof weight][1]
  );

  const freq_limits = freqLimitsHandler(limits.push, limits.pull, limits.legs);

  const min_sessions_totaled =
    freq_limits.push.min + freq_limits.pull.min + freq_limits.legs.min;
  const remainder = min_sessions_totaled - total_sessions;
  // min_sessions_totaled = 8.5

  let overSessions = remainder;

  const canCombinePushAndPull = (
    pullMin: number,
    pushMin: number,
    subVal: number
  ): [string, number] | null => {
    const canSubBoth = pullMin >= subVal && pushMin >= subVal;
    const canSubPull = pullMin >= subVal;
    const canSubPush = pushMin >= subVal;
    if (canSubBoth) return ["both", subVal];
    else if (canSubPull) return ["pull", pullMin];
    else if (canSubPush) return ["push", pushMin];
    else return null;
  };

  // current
  let push = 0;
  let pull = 0;
  let legs = 0;
  let upper = 0;
  let full = 2;

  let subtractor = 1;

  const sortSessions = (
    pull: number,
    push: number,
    legs: number,
    full: number,
    type: "current" | "distFromMax"
  ) => {
    let pushPullLegsTuple: [string, number][] = [
      ["push", push],
      ["pull", pull],
      ["legs", legs],
    ];

    if (type === "current") {
      pushPullLegsTuple.sort((a, b) => b[1] - a[1]);
    } else {
      const distFromMax: [string, number][] = [
        ["push", freq_limits.push.max - push - full],
        ["pull", freq_limits.pull.max - pull - full],
        ["legs", freq_limits.legs.max - legs - full],
      ];
      pushPullLegsTuple = distFromMax.sort((a, b) => b[1] - a[1]);
    }
    return pushPullLegsTuple;
  };

  const canSubtractFromSplit = (
    type: "push" | "pull" | "legs",
    curr: number
  ) => {
    const { min, max } = freq_limits[type];
    if (curr > max) {
      return true;
    } else if (curr - 1 >= min) {
      return true;
    } else {
      return false;
    }
  };

  const isSplitHigherPriority = (
    target: "push" | "pull" | "legs",
    check: "push" | "pull" | "legs"
  ) => {
    let targetIndex = 0;
    let checkIndex = 0;
    for (let i = 0; i < prioritizedSplits.length; i++) {
      if (prioritizedSplits[i] === target) {
        targetIndex = i;
      }
      if (prioritizedSplits[i] === check) {
        checkIndex = i;
      }
    }
    return targetIndex < checkIndex;
  };

  full = 2;
  upper = total_sessions - full;

  const prioritizedSplits = weight_order;
  let unloop = false;

  let pushAdd = true;
  let pushSub = true;
  let pullAdd = true;
  let pullSub = true;
  let legsAdd = true;
  let legsSub = true;

  while (!unloop) {
    console.log(
      push,
      pull,
      upper,
      legs,
      full,
      prioritizedSplits,
      "beginning of while loop"
    );
    for (const split of prioritizedSplits) {
      if (split === "push") {
        const totalPush = push + pull + legs;
        const { min, max } = freq_limits.push;
        if (max === upper + full + push) {
          pushAdd = false;
          if (upper + full > min) {
            pushSub = true;
          } else {
            pushSub = false;
          }
        } else if (max < upper + full + push) {
          const first = sortSessions(
            upper + pull,
            upper + push,
            legs,
            full,
            "distFromMax"
          )[0];

          if (first[0] === "legs") {
            if (first[1] < 1) {
              if (full > 0) {
                legs++;
                full--;
              }
            } else {
              legs++;
              upper--;
            }
          } else {
            const pullMax = freq_limits.pull;
            if (upper + full === pullMax.max) {
              pull++;
              upper--;
            }
            console.log(first, upper, full, legs, "got a pull in my push");
          }

          if (upper + full + push - 1 > max) {
            pushSub = true;
            pushAdd = false;
          } else if (upper + full + push > max) {
            pushAdd = true;
          } else {
            pushSub = false;
            pushAdd = false;
          }
        } else {
          // push is not maxed -- only thing i can pull from is legs || full
          const canSub = canSubtractFromSplit("legs", legs + full);
          if (canSub) {
            legs--;
            // possibly check whether i should add to push vs. upper
            upper++;
          }
          if (upper + full + push === max) {
            pushAdd = false;
            pushSub = false;
          } else {
            // gotta check if pushAdd is possible
            if (full < 1) {
              pushAdd = true;
            }
            if (
              isSplitHigherPriority("push", "legs") &&
              legs + full > freq_limits.legs.min
            ) {
              pushAdd = true;
            } else {
              pushAdd = false;
            }
            pushSub = false;
          }
        }
      } else if (split === "pull") {
        const { min, max } = freq_limits.pull;
        if (max === upper + full + pull) {
          pullAdd = false;
          if (upper + full + pull > min) {
            pullSub = true;
          } else {
            pullSub = false;
          }
        } else if (max < upper + full + pull) {
          const first = sortSessions(
            upper + pull,
            upper + push,
            legs,
            full,
            "distFromMax"
          )[0];

          if (first[0] === "legs") {
            if (first[1] < 1) {
              if (full > 0) {
                legs++;
                full--;
              }
            } else {
              legs++;
              upper--;
            }
          } else {
            const pushMax = freq_limits.push;
            if (upper + full + push === pushMax.max) {
              push++;
              upper--;
            }
            console.log(first, upper, full, legs, "got a push in my pull");
          }

          if (upper + full + pull - 1 > max) {
            pullSub = true;
            pullAdd = false;
          } else if (upper + full > max) {
            pullAdd = true;
          } else {
            pullSub = false;
            pullAdd = false;
          }
        } else {
          // push is not maxed -- only thing i can pull from is legs || full
          const canSub = canSubtractFromSplit("legs", legs + full);
          if (canSub) {
            legs--;
            // possilby check whether i should add to push vs. upper
            upper++;
          }
          if (upper + full === max) {
            pullAdd = false;
            pullSub = false;
          } else {
            if (full < 1) {
              pullAdd = true;
            }
            if (
              isSplitHigherPriority("pull", "legs") &&
              legs + full > freq_limits.legs.min
            ) {
              pullAdd = true;
            } else {
              pullAdd = false;
            }
            pullSub = false;
          }
        }
      } else {
        const { min, max } = freq_limits.legs;
        if (max === legs + full) {
          legsAdd = false;
          if (legs + full > min) {
            legsSub = true;
          } else {
            legsSub = false;
          }
        } else if (max < legs + full) {
          const first = sortSessions(pull, push, legs, full, "distFromMax")[0];
          if (first[0] === "push" || first[0] === "pull") {
            upper++;
            legs--;
          } else {
            console.log(upper, full, legs, "got a leg in my legs");
          }

          if (legs + full - 1 > max) {
            legsSub = true;
            legsAdd = false;
          } else {
            legsSub = false;
            legsAdd = false;
          }
        } else {
          // push is not maxed -- only thing i can pull from is legs || full
          const canSubFromPull = canSubtractFromSplit("pull", upper + full);
          const canSubFromPush = canSubtractFromSplit("push", upper + full);

          // if subtracting 1 from max >
          const pushOrPullMax = Math.max(
            freq_limits.push.max,
            freq_limits.pull.max
          );
          const subtractedCurrent = upper + full - 1;
          const addedLegsCurrent = legs + full + 1;
          console.log(
            pushOrPullMax,
            subtractedCurrent,
            legs,
            upper,
            full,
            "WTF AM I HERE EVEN?"
          );
          if (
            pushOrPullMax - subtractedCurrent >
            freq_limits.legs.max - addedLegsCurrent
          ) {
            console.log("AM I HEREE VEN?");
            legsAdd = false;
            pushAdd = false;
            pullAdd = false;
            break;
          }
          if (canSubFromPull || canSubFromPush) {
            upper--;
            // possilby check whether i should add to push vs. upper
            legs++;
          }
          if (legs + full === max) {
            legsAdd = false;
            legsSub = false;
          } else {
            const higherThanPull = isSplitHigherPriority("legs", "pull");
            const higherThanPush = isSplitHigherPriority("legs", "push");
            const upperHigherThanPull = upper + full > freq_limits.pull.min;
            const upperHigherThanPush = upper + full > freq_limits.push.min;
            if (full < 1) {
              legsAdd = true;
            }
            if (
              higherThanPull &&
              higherThanPush &&
              upperHigherThanPull &&
              upperHigherThanPush
            ) {
              legsAdd = true;
            } else {
              legsAdd = false;
            }
            legsSub = false;
          }
        }
      }
    }

    console.log(
      pushAdd,
      pullAdd,
      legsAdd,
      push,
      pull,
      upper,
      legs,
      full,
      "end of while loop"
    );

    if (!pushAdd && !pullAdd && !legsAdd) {
      unloop = true;
    }
    // unloop = true;
  }

  console.log(
    "push:",
    push,
    "pull:",
    pull,
    "upper:",
    upper,
    "legs:",
    legs,
    "full:",
    full,
    subtractor,
    overSessions,
    "OK WHAT THESE?"
  );
  return {
    push: push,
    pull: pull,
    upper: upper,
    legs: legs,
    full: full,
  };
};

export const getMaxFrequencyByMatrix = (
  range: string,
  rank: number,
  mrv_breakpoint: number
) => {
  switch (range) {
    case "3,6":
      return THREE_SIX[mrv_breakpoint][rank];
    case "3,4":
      return THREE_FOUR[mrv_breakpoint][rank];
    case "2,4":
      return TWO_FOUR[mrv_breakpoint][rank];
    case "2,3":
      return TWO_THREE[mrv_breakpoint][rank];
    case "2,5":
      return TWO_FIVE[mrv_breakpoint][rank];
    default:
      return THREE_SIX[3][0];
  }
};

// export const getMaxFrequencyByMatrix = (
//   range: string,
//   rank: number,
//   mrv_breakpoint: number
// ) => {
//   switch (range) {
//     case "3,6":
//       return [THREE_SIX_MIN[mrv_breakpoint][rank], THREE_SIX[mrv_breakpoint][rank]]
//     case "3,4":
//       return [THREE_FOUR_MIN[mrv_breakpoint][rank], THREE_FOUR[mrv_breakpoint][rank]]
//     case "2,4":
//       return [TWO_FOUR_MIN[mrv_breakpoint][rank], TWO_FOUR[mrv_breakpoint][rank]]
//     case "2,5":
//       return [TWO_FIVE_MIN[mrv_breakpoint][rank], TWO_FIVE[mrv_breakpoint][rank]]
//     default:
//       return [THREE_SIX_MIN[3][0], THREE_SIX[3][0]]
//   }
// };
const THREE_SIX = [
  [6],
  [6, 6],
  [6, 6, 5],
  [6, 5, 5, 4],
  [5, 5, 4, 3, 3],
  [5, 4, 3, 3, 3, 3],
  [4, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_SIX_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 4, 3, 3],
  [4, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 4, 3],
  [4, 4, 3, 3, 3],
  [4, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const THREE_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 4],
  [3, 3, 3, 3],
  [3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3],
  [3, 3, 3, 3, 3, 3, 3, 3],
];
const TWO_THREE = [
  [3],
  [3, 3],
  [3, 3, 3],
  [3, 3, 3, 3],
  [3, 3, 3, 2, 2],
  [3, 3, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FOUR = [
  [4],
  [4, 4],
  [4, 4, 4],
  [4, 4, 3, 3],
  [4, 4, 3, 3, 2],
  [4, 3, 3, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2],
  [3, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FOUR_MIN = [
  [4],
  [4, 4],
  [4, 4, 3],
  [3, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE = [
  [5],
  [5, 5],
  [5, 5, 5],
  [5, 5, 4, 4],
  [5, 4, 4, 3, 3],
  [4, 4, 3, 3, 2, 2],
  [4, 3, 3, 2, 2, 2, 2],
  [3, 3, 2, 2, 2, 2, 2, 2],
];
const TWO_FIVE_MIN = [
  [5],
  [5, 5],
  [5, 5, 4],
  [4, 3, 3, 2],
  [3, 3, 2, 2, 2],
  [3, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

// export const distributeWeightsIntoSessions = (
//   total_sessions: number,
//   limits: {
//     push: number[];
//     pull: number[];
//     legs: number[];
//   }
// ) => {
//   const weight = {
//     push: 29.02,
//     pull: 32.14,
//     legs: 25.14,
//   };
//   const weight_order = Object.keys(weight).sort(
//     (a, b) =>
//       weight[b as keyof typeof weight] - weight[a as keyof typeof weight]
//   );

//   const count = {
//     push: 2,
//     pull: 2,
//     legs: 1,
//     upper: 0,
//     full: 0,
//   };

//   const freq_limits = freqLimitsHandler(limits.push, limits.pull, limits.legs);

//   const min_sessions_totaled =
//     freq_limits.push.min + freq_limits.pull.min + freq_limits.legs.min;
//   const remainder = min_sessions_totaled - total_sessions;
//   // min_sessions_totaled = 8.5

//   let overSessions = remainder;

//   const freq_limits_2 = {
//     upper: Math.max(freq_limits.push.max, freq_limits.pull.max),
//     full: 2,
//     push: freq_limits.push.max,
//     pull: freq_limits.pull.max,
//     legs: freq_limits.legs.max,
//   };

//   const canCombinePushAndPull = (
//     pullMin: number,
//     pushMin: number,
//     subVal: number
//   ): [string, number] | null => {
//     const canSubBoth = pullMin >= subVal && pushMin >= subVal;
//     const canSubPull = pullMin >= subVal;
//     const canSubPush = pushMin >= subVal;
//     if (canSubBoth) return ["both", subVal];
//     else if (canSubPull) return ["pull", pullMin];
//     else if (canSubPush) return ["push", pushMin];
//     else return null;
//   };

//   // current
//   let push = freq_limits.push.min;
//   let pull = freq_limits.pull.min;
//   let legs = 0;
//   let upper = 0;
//   let full = 2;

//   let full_limit = 2;
//   let subtractor = 1;

//   const current = {
//     push: push + upper + full,
//     pull: pull + upper + full,
//     legs: legs + full,
//   };

//   // combine enough push and pulls to get within total_frequency
//   while (overSessions > 0 || subtractor <= 0) {
//     const val = canCombinePushAndPull(pull, push, subtractor);
//     if (!val) {
//       subtractor -= 0.5;
//     } else if (val[0] === "both") {
//       upper += subtractor;
//       push -= subtractor;
//       pull -= subtractor;
//       overSessions -= subtractor;
//     } else if (val[0] === "pull") {
//       upper += subtractor;
//       pull -= subtractor;
//       overSessions -= subtractor;
//     } else if (val[0] === "push") {
//       upper += subtractor;
//       push -= subtractor;
//       overSessions -= subtractor;
//     } else {
//       break;
//     }
//   }

//   subtractor = 1;
//   let remaining_push_pulls = push !== pull && (push > 0 || pull > 0);
//   while (remaining_push_pulls) {
//     const val = canCombinePushAndPull(pull, push, subtractor);
//     if (!val) {
//       break;
//     } else if (val[0] === "both") {
//       upper += subtractor;
//       pull -= subtractor;
//       push -= subtractor;
//     } else if (val[0] === "push") {
//       upper += subtractor;
//       push -= subtractor;
//     } else if (val[0] === "pull") {
//       upper += subtractor;
//       pull -= subtractor;
//     } else {
//       break;
//     }
//   }

//   const sortSessions = (
//     pull: number,
//     push: number,
//     legs: number,
//     type: "current" | "distFromMax"
//   ) => {
//     let pushPullLegsTuple: [string, number][] = [
//       ["push", push],
//       ["pull", pull],
//       ["legs", legs],
//     ];

//     if (type === "current") {
//       pushPullLegsTuple.sort((a, b) => b[1] - a[1]);
//     } else {
//       const distFromMax: [string, number][] = [
//         ["push", freq_limits.push.max - push],
//         ["pull", freq_limits.pull.max - pull],
//         ["legs", freq_limits.legs.max - legs],
//       ];
//       pushPullLegsTuple = distFromMax.sort((a, b) => b[1] - a[1]);
//     }
//     return pushPullLegsTuple;
//   };

//   const canSubtractFromSplit = (
//     type: "push" | "pull" | "legs",
//     curr: number
//   ) => {
//     const { min, max } = freq_limits[type];
//     if (curr > max) {
//       return true;
//     } else if (curr - 1 >= min) {
//       return true;
//     } else {
//       return false;
//     }
//   };

//   const isSplitHigherPriority = (
//     target: "push" | "pull" | "legs",
//     check: "push" | "pull" | "legs"
//   ) => {
//     let targetIndex = 0;
//     let checkIndex = 0;
//     for (let i = 0; i < prioritizedSplits.length; i++) {
//       if (prioritizedSplits[i] === target) {
//         targetIndex = i;
//       }
//       if (prioritizedSplits[i] === check) {
//         checkIndex = i;
//       }
//     }
//     return targetIndex < checkIndex;
//   };

//   full = 2;
//   upper = total_sessions - full;

//   const prioritizedSplits = ["legs", "pull", "push"];
//   let unloop = false;

//   let pushAdd = true;
//   let pushSub = true;
//   let pullAdd = true;
//   let pullSub = true;
//   let legsAdd = true;
//   let legsSub = true;
//   while (!unloop) {
//     console.log(push, pull, upper, legs, full, "beginning of while loop");
//     for (const split of prioritizedSplits) {
//       if (split === "push") {
//         const { min, max } = freq_limits.push;
//         if (max === upper + full) {
//           pushAdd = false;
//           if (upper > min) {
//             pushSub = true;
//           } else {
//             pushSub = false;
//           }
//         } else if (max < upper + full) {
//           const first = sortSessions(pull, push, legs, "distFromMax")[0];
//           if (first[0] === "legs") {
//             legs++;
//             upper--;
//           } else {
//             console.log(upper, full, legs, "got a pull in my push");
//           }

//           if (upper + full - 1 > max) {
//             pushSub = true;
//             pushAdd = false;
//           } else {
//             pushSub = false;
//             pushAdd = false;
//           }
//         } else {
//           // push is not maxed -- only thing i can pull from is legs || full
//           const canSub = canSubtractFromSplit("legs", legs + full);
//           if (canSub) {
//             legs--;
//             // possibly check whether i should add to push vs. upper
//             upper++;
//           }
//           if (upper + full === max) {
//             pushAdd = false;
//             pushSub = false;
//           } else {
//             // gotta check if pushAdd is possible
//             if (full < 1) {
//               pushAdd = true;
//             }
//             if (
//               isSplitHigherPriority("push", "legs") &&
//               legs + full > freq_limits.legs.min
//             ) {
//               pushAdd = true;
//             } else {
//               pushAdd = false;
//             }
//             pushSub = false;
//           }
//         }
//       } else if (split === "pull") {
//         const { min, max } = freq_limits.pull;
//         if (max === upper + full) {
//           pullAdd = false;
//           if (upper > min) {
//             pullSub = true;
//           } else {
//             pullSub = false;
//           }
//         } else if (max < upper + full) {
//           const first = sortSessions(pull, push, legs, "distFromMax")[0];
//           if (first[0] === "legs") {
//             legs++;
//             upper--;
//           } else {
//             console.log(upper, full, legs, "got a push in my pull");
//           }

//           if (upper + full - 1 > max) {
//             pullSub = true;
//             pullAdd = false;
//           } else {
//             pullSub = false;
//             pullAdd = false;
//           }
//         } else {
//           // push is not maxed -- only thing i can pull from is legs || full
//           const canSub = canSubtractFromSplit("legs", legs + full);
//           if (canSub) {
//             legs--;
//             // possilby check whether i should add to push vs. upper
//             upper++;
//           }
//           if (upper + full === max) {
//             pullAdd = false;
//             pullSub = false;
//           } else {
//             if (full < 1) {
//               pullAdd = true;
//             }
//             if (
//               isSplitHigherPriority("pull", "legs") &&
//               legs + full > freq_limits.legs.min
//             ) {
//               pullAdd = true;
//             } else {
//               pullAdd = false;
//             }
//             pullSub = false;
//           }
//         }
//       } else {
//         const { min, max } = freq_limits.legs;
//         if (max === legs + full) {
//           legsAdd = false;
//           if (legs > min) {
//             legsSub = true;
//           } else {
//             legsSub = false;
//           }
//         } else if (max < legs + full) {
//           const first = sortSessions(pull, push, legs, "distFromMax")[0];
//           if (first[0] === "push" || first[0] === "pull") {
//             upper++;
//             legs--;
//           } else {
//             console.log(upper, full, legs, "got a leg in my legs");
//           }

//           if (legs + full - 1 > max) {
//             legsSub = true;
//             legsAdd = false;
//           } else {
//             legsSub = false;
//             legsAdd = false;
//           }
//         } else {
//           // push is not maxed -- only thing i can pull from is legs || full
//           const canSubFromPull = canSubtractFromSplit("pull", upper + full);
//           const canSubFromPush = canSubtractFromSplit("push", upper + full);

//           if (canSubFromPull || canSubFromPush) {
//             upper--;
//             // possilby check whether i should add to push vs. upper
//             legs++;
//           }
//           if (legs + full === max) {
//             legsAdd = false;
//             legsSub = false;
//           } else {
//             const higherThanPull = isSplitHigherPriority("legs", "pull");
//             const higherThanPush = isSplitHigherPriority("legs", "push");
//             const upperHigherThanPull = upper + full > freq_limits.pull.min;
//             const upperHigherThanPush = upper + full > freq_limits.push.min;
//             if (full < 1) {
//               legsAdd = true;
//             }
//             if (
//               higherThanPull &&
//               higherThanPush &&
//               upperHigherThanPull &&
//               upperHigherThanPush
//             ) {
//               legsAdd = true;
//             } else {
//               legsAdd = false;
//             }
//             legsSub = false;
//           }
//         }
//       }
//     }

//     console.log(
//       pushAdd,
//       pullAdd,
//       legsAdd,
//       push,
//       pull,
//       upper,
//       legs,
//       full,
//       "end of while loop"
//     );

//     if (!pushAdd && !pullAdd && !legsAdd) {
//       unloop = true;
//     }
//     // unloop = true;
//   }

//   console.log(
//     "push:",
//     push,
//     "pull:",
//     pull,
//     "upper:",
//     upper,
//     "legs:",
//     legs,
//     "full:",
//     full,
//     subtractor,
//     overSessions,
//     "OK WHAT THESE?"
//   );
// };
