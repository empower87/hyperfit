import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  MUSCLE_WEIGHTS_MODIFIERS,
  RANK_WEIGHTS,
} from "~/constants/weighting/muscles";
import { getPrioritizedPPL } from "~/constants/workoutSplits";
import { distributeWeightsIntoSessions } from "~/hooks/useTrainingProgram/reducer/distributeWeightsIntoSessions";
import {
  getRankWeightsBySplit,
  getSplitFromWeights,
  handleDistribution,
  maths,
} from "~/hooks/useTrainingProgram/reducer/getSplitFromPriorityWeighting";

import {
  INITIAL_STATE,
  INITIAL_WEEK,
  State as ProgramConfigState,
  TrainingDayType,
  type MusclePriorityType,
  type SplitSessionsNameType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { distributeSplitAcrossWeek } from "~/hooks/useTrainingProgram/utils/distributeSplitAcrossTrainingWeek";
import {
  onReorderUpdateMusclePriorityList,
  reorderListByVolumeBreakpoints,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";

function useProgramConfig() {
  const {
    prioritized_muscle_list,
    mrv_breakpoint,
    mev_breakpoint,
    training_week,
    split_sessions,
    training_program_params,
    frequency,
    training_block,
    handleOnProgramConfigChange,
  } = useTrainingProgramContext();
  const [programConfig, setProgramConfig] = useState<ProgramConfigState>({
    ...INITIAL_STATE,
  });

  const [volumeBreakpoints, setVolumeBreakpoints] = useState<[number, number]>([
    mrv_breakpoint,
    mev_breakpoint,
  ]);
  const [sessionsTest, setSessionsTest] = useState<
    { session: string; modifiers: number[] }[]
  >([]);
  const [priorityListTest, setPriorityListTest] = useState<
    { muscle: MusclePriorityType; index: number; modifiers: number[] }[]
  >([]);
  const [avgFrequencies, setAvgFrequencies] = useState<{
    push: number[];
    pull: number[];
    legs: number[];
  }>({
    push: [],
    pull: [],
    legs: [],
  });

  const [testSessions, setTestSessions] = useState<{
    push: number;
    pull: number;
    upper: number;
    legs: number;
    full: number;
  }>({ push: 0, pull: 0, upper: 0, legs: 0, full: 0 });
  useEffect(() => {
    setProgramConfig({
      muscle_priority_list: prioritized_muscle_list,
      mrv_breakpoint: mrv_breakpoint,
      mev_breakpoint: mev_breakpoint,
      training_week: training_week,
      split_sessions: split_sessions,
      training_program_params: training_program_params,
      frequency: frequency,
      training_block: training_block,
    });
  }, [
    frequency,
    prioritized_muscle_list,
    mrv_breakpoint,
    mev_breakpoint,
    training_week,
    split_sessions,
    training_program_params,
    training_block,
  ]);

  const onFrequencyChange = useCallback(
    (values: [number, number]) => {
      const { split_sessions, muscle_priority_list } = programConfig;
      const new_split_sessions = getSplitFromWeights(
        values,
        muscle_priority_list,
        split_sessions.split
      );
      const new_training_week = distributeSplitAcrossWeek(
        values,
        new_split_sessions
      );

      setProgramConfig((prev) => ({
        ...prev,
        frequency: values,
        split_sessions: new_split_sessions,
        training_week: new_training_week,
      }));
    },
    [programConfig]
  );

  const onSplitChange = useCallback(
    (split: SplitSessionsNameType) => {
      // setSplit(split);
      const {
        frequency,
        muscle_priority_list,
        mrv_breakpoint,
        mev_breakpoint,
      } = programConfig;
      const new_split_sessions = getSplitFromWeights(
        frequency,
        muscle_priority_list,
        split
      );
      const new_training_week = distributeSplitAcrossWeek(
        frequency,
        new_split_sessions
      );

      const sesh = getRankWeightsBySplit(
        muscle_priority_list,
        new_split_sessions.split,
        [mrv_breakpoint, mev_breakpoint]
      );
      const mathss = maths(sesh, frequency[0] + frequency[1]);

      const priorityListTests = muscle_priority_list.map((each, index) => {
        const weight = MUSCLE_WEIGHTS_MODIFIERS[each.muscle].weight;
        const optFreq = MUSCLE_WEIGHTS_MODIFIERS[each.muscle].optimalFrequency;
        const volume = MUSCLE_WEIGHTS_MODIFIERS[each.muscle].muscleVolume;
        const rankWeight = RANK_WEIGHTS[index];
        return {
          muscle: each,
          index: index + 1,
          modifiers: [
            optFreq,
            weight,
            volume,
            rankWeight,
            Math.round(optFreq * volume * rankWeight * 100) / 100,
          ],
        };
      });
      const lol = handleDistribution(muscle_priority_list, mathss);
      const prioritizedSplits = getPrioritizedPPL(muscle_priority_list);
      const TEST = distributeWeightsIntoSessions(
        programConfig.frequency[0] + programConfig.frequency[1],
        lol,
        prioritizedSplits
      );
      setTestSessions(TEST);
      setAvgFrequencies(lol);
      console.log(lol, "WHAT HTIS LOOK LIKE?");
      setSessionsTest(mathss);
      setPriorityListTest(priorityListTests);
      setProgramConfig((prev) => ({
        ...prev,
        split_sessions: new_split_sessions,
        training_week: new_training_week,
      }));
    },
    [programConfig]
  );

  const onRearrangedWeek = useCallback(
    (rearranged_week: TrainingDayType[]) => {
      // const updated_week = onRearrangeTrainingWeek(
      //   rearranged_week,
      //   programConfig.split_sessions
      // );
      // NOTE: updates training week's isTrainingDay boolean on UI change.
      //       may not need this boolean, but instead just check sessions.length
      //       to determine if a day is a training day or not.
      // const revised_training_week = rearranged_week.map((each) => {
      //   const sessions = each.sessions.map((ea) => ea.split);
      //   let isTrainingDay = true;
      //   if (sessions.length === 0) {
      //     isTrainingDay = false;
      //   }
      //   return {
      //     ...each,
      //     isTrainingDay: isTrainingDay,
      //   };
      // });
      // setTrainingWeek(revised_training_week);

      const updateTrainingDay = rearranged_week.map((each) => {
        let hasTrainingDay = false;
        each.sessions.forEach((each) => {
          if (each.split !== "off") {
            hasTrainingDay = true;
          }
        });
        return { ...each, isTrainingDay: hasTrainingDay };
      });

      setProgramConfig((prev) => ({
        ...prev,
        training_week: updateTrainingDay,
      }));
    },
    [programConfig]
  );

  const onPriorityListDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const items = [...programConfig.muscle_priority_list];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        volumeBreakpoints
      );

      setProgramConfig((prev) => ({
        ...prev,
        muscle_priority_list: reordered_items,
      }));
    },
    [programConfig, volumeBreakpoints]
  );

  const onSelectVolumeLandmarkChange = useCallback(
    (id: MusclePriorityType["id"], volume_landmark: VolumeLandmarkType) => {
      const list = structuredClone(programConfig.muscle_priority_list);
      const index = list.findIndex((item) => item.id === id);
      list[index].volume.landmark = volume_landmark;
      const { newList, newVolumeBreakpoints } =
        reorderListByVolumeBreakpoints(list);

      setVolumeBreakpoints(newVolumeBreakpoints);
      setProgramConfig((prev) => ({ ...prev, muscle_priority_list: newList }));
    },
    [programConfig, volumeBreakpoints]
  );

  const onBreakpointChange = useCallback(
    (type: "MRV" | "MEV", value: number) => {
      const new_breakpoints: [number, number] = [...volumeBreakpoints];
      const index = type === "MRV" ? 0 : 1;
      new_breakpoints[index] = value;
      setVolumeBreakpoints(new_breakpoints);

      const items = [...programConfig.muscle_priority_list];
      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        new_breakpoints
      );
      // setDraggableList(reordered_items);

      setProgramConfig((prev) => ({
        ...prev,
        muscle_priority_list: reordered_items,
      }));
    },
    [volumeBreakpoints, programConfig]
  );

  const onToggleBreakpoints = useCallback(
    (type: "All MEV" | "All MV") => {
      const new_breakpoints: [number, number] = [...volumeBreakpoints];
      if (type === "All MEV") {
        if (new_breakpoints[0] === 0 && new_breakpoints[1] === 14) {
          new_breakpoints[0] = mrv_breakpoint;
          new_breakpoints[1] = mev_breakpoint;
        } else {
          new_breakpoints[0] = 0;
          new_breakpoints[1] = 14;
        }
      } else {
        if (new_breakpoints[0] === 0 && new_breakpoints[1] === 0) {
          new_breakpoints[0] = mrv_breakpoint;
          new_breakpoints[1] = mev_breakpoint;
        } else {
          new_breakpoints[0] = 0;
          new_breakpoints[1] = 0;
        }
      }

      setVolumeBreakpoints(new_breakpoints);
      const items = [...programConfig.muscle_priority_list];

      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        new_breakpoints
      );

      setProgramConfig((prev) => ({
        ...prev,
        muscle_priority_list: reordered_items,
      }));
    },
    [volumeBreakpoints, programConfig]
  );

  const onSaveConfig = useCallback(() => {
    const {
      frequency,
      muscle_priority_list,
      training_program_params,
      split_sessions,
      training_week,
    } = programConfig;
    handleOnProgramConfigChange(
      frequency,
      split_sessions.split,
      muscle_priority_list,
      training_program_params,
      training_week
    );
  }, [programConfig]);

  return {
    muscle_priority_list: programConfig.muscle_priority_list,
    sessionsTest,
    priorityListTest,
    avgFrequencies,
    volumeBreakpoints,
    trainingWeek: programConfig.training_week,
    split_sessions: programConfig.split_sessions,
    training_program_params: programConfig.training_program_params,
    frequency: programConfig.frequency,
    split: programConfig.split_sessions.split,
    onSaveConfig,
    onSplitChange,
    onFrequencyChange,
    onPriorityListDragEnd,
    onBreakpointChange,
    onToggleBreakpoints,
    onRearrangedWeek,
    onSelectVolumeLandmarkChange,
    testSessions,
  };
}

type ProgramConfigType = ReturnType<typeof useProgramConfig>;

const ProgramConfigContext = createContext<ProgramConfigType>({
  muscle_priority_list: INITIAL_STATE.muscle_priority_list,
  sessionsTest: [],
  priorityListTest: [],
  avgFrequencies: { push: [], pull: [], legs: [] },
  volumeBreakpoints: [4, 9],
  trainingWeek: INITIAL_WEEK,
  split_sessions: INITIAL_STATE.split_sessions,
  training_program_params: INITIAL_STATE.training_program_params,
  frequency: INITIAL_STATE.frequency,
  split: "OPT",
  onSaveConfig: () => null,
  onSplitChange: () => null,
  onFrequencyChange: () => null,
  onPriorityListDragEnd: () => null,
  onBreakpointChange: () => null,
  onToggleBreakpoints: () => null,
  onRearrangedWeek: () => null,
  onSelectVolumeLandmarkChange: () => null,
  testSessions: { push: 0, pull: 0, upper: 0, legs: 0, full: 0 },
});

const ProgramConfigProvider = ({ children }: { children: ReactNode }) => {
  const values = useProgramConfig();
  // const contextValues = useMemo(() => values, [values]);
  return (
    <ProgramConfigContext.Provider value={values}>
      {children}
    </ProgramConfigContext.Provider>
  );
};

const useProgramConfigContext = () => {
  return useContext(ProgramConfigContext);
};

export { ProgramConfigProvider, useProgramConfigContext };

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

type OPTTotalType = {
  push: number;
  pull: number;
  legs: number;
  upper: number;
  full: number;
};

const isSplitHigherPriority = (
  target: "push" | "pull" | "legs",
  check: "push" | "pull" | "legs",
  prioritizedSplits: string[]
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

export const pushPullDistribution = (
  type: "push" | "pull",
  over_under: "over" | "under",
  freq_limits: MaxSessionsPerSplit,
  _totals: OPTTotalType,
  prioritizedSplits: string[]
) => {
  let totals = { ..._totals };
  let tarType: "push" | "pull" = "push";
  let altType: "push" | "pull" = "pull";

  let pushLimit = freq_limits.push;
  let pullLimit = freq_limits.pull;
  const legsLimit = freq_limits.legs;

  let pullTotal = totals.pull + totals.upper + totals.full;
  let pushTotal = totals.push + totals.upper + totals.full;
  const legsTotal = totals.legs + totals.full;

  let pullDistFromMax = pullLimit.max - pullTotal;
  let pushDistFromMax = pushLimit.max - pushTotal;
  const legsDistFromMax = legsLimit.max - legsTotal;

  if (type === "pull") {
    tarType = "pull";
    altType = "push";
    pushLimit = freq_limits.pull;
    pullLimit = freq_limits.push;
    pushTotal = totals.pull + totals.upper + totals.full;
    pullTotal = totals.push + totals.upper + totals.full;
    pushDistFromMax = pullLimit.max - pullTotal;
    pullDistFromMax = pushLimit.max - pushTotal;
  }

  let isNotBroken = true;
  console.log(
    _totals,
    totals,
    isNotBroken,
    over_under,
    `${type} DISTRIBUTION BEFORE`
  );

  if (pullDistFromMax > 0) {
    // LEGS: under max && PUSH || PULL: under max
    if (legsDistFromMax > 0) {
      if (over_under === "over") {
        const legsHigher = isSplitHigherPriority(
          "legs",
          altType,
          prioritizedSplits
        );

        if (totals[tarType] > 0) {
          totals[tarType]--;
          if (legsHigher) {
            totals.legs++;
          } else {
            totals[altType]++;
          }
        } else {
          if (legsHigher) {
            totals.upper--;
            totals.legs++;
          } else {
            totals.upper--;
            totals[altType]++;
          }
        }
      } else {
        // NOTE: should probably check distance each is from max
        isNotBroken = false;
      }
    }
    // LEGS: over max && PUSH || PULL: under max
    else if (legsDistFromMax < 0) {
      if (over_under === "over") {
        if (totals[tarType] > 0) {
          totals[tarType]--;
          totals[altType]++;
        } else if (totals.full > 0) {
          totals.full--;
          totals[altType]++;
        } else {
          totals.upper--;
          totals[altType]++;
        }
      } else {
        if (totals.legs > 0) {
          totals.legs--;
          totals.upper++;
        } else {
          totals.full--;
          totals.upper++;
        }
      }
    }
    // LEGS: at max && PUSH || PULL: under max
    else {
      if (over_under === "over") {
        if (totals[tarType] > 0) {
          totals[tarType]--;
          totals[altType]++;
        } else {
          totals.upper--;
          totals[altType]++;
        }
      } else {
        const higherThanPush = isSplitHigherPriority(
          "legs",
          "push",
          prioritizedSplits
        );
        const higherThanPull = isSplitHigherPriority(
          "legs",
          "pull",
          prioritizedSplits
        );

        if (higherThanPush && higherThanPull) {
          isNotBroken = false;
        } else {
          totals.legs--;
          totals.upper++;
        }
      }
    }
  } else if (pullDistFromMax < 0) {
    // LEGS: under max && PUSH || PULL: over max
    if (legsDistFromMax > 0) {
      if (over_under === "over") {
        totals.upper--;
        totals.legs++;
      } else {
        if (totals[altType] > 0) {
          totals[altType]--;
          totals[tarType]++;
        } else {
          totals.upper--;
          totals[tarType]++;
        }
      }
    }
    // LEGS: over max && PUSH || PULL: over max
    else if (legsDistFromMax < 0) {
      if (over_under === "over") {
        if (totals.full > 0) {
          totals.full--;
          const pushHigherThanPush = isSplitHigherPriority(
            "push",
            "legs",
            prioritizedSplits
          );
          const pushHigherThanPull = isSplitHigherPriority(
            "pull",
            "legs",
            prioritizedSplits
          );

          if (pushHigherThanPull && pushHigherThanPush) {
            totals[altType]++;
          } else {
            totals.legs++;
          }
        } else {
          isNotBroken = false;
        }
      } else {
        if (totals.legs > 0) {
          totals.legs--;
          totals[tarType]++;
        } else {
          totals.full--;
          totals[tarType]++;
        }
      }
    }
    // LEGS: at max && PUSH || PULL: over max
    else {
      if (over_under === "over") {
        if (totals.full > 0) {
          totals.full--;
          totals.legs++;
        } else {
          isNotBroken = false;
        }
      } else {
        if (totals[altType] > 0) {
          totals[altType]--;
          totals[tarType]++;
        } else {
          totals.upper--;
          totals[tarType]++;
        }
      }
    }
  } else {
    // LEGS: under max && PUSH || PULL: at max
    if (legsDistFromMax > 0) {
      if (over_under === "over") {
        if (totals[tarType] > 0) {
          totals[tarType]--;
          totals.legs++;
        } else {
          // lots of potential here
          const pushDist =
            pushLimit.max - (totals.push + totals.upper + totals.full - 1);
          const pullDist =
            pullLimit.max - (totals.pull + totals.upper + totals.full - 1);
          const legsDist = legsLimit.max - (totals.legs + totals.full + 1);

          if (pushDist <= 1 && pullDist <= 1 && legsDist <= 1) {
            totals.upper--;
            totals.legs++;
            isNotBroken = false;
          } else {
            isNotBroken = false;
            console.log(pushDist, pullDist, legsDist, "BROKE DISTRIBUTION LOL");
          }
        }
      } else {
        // INIFITE LOOP HERE - 1. rear_delts 2. side_delts 3. quads 4. glutes
        // pull 6
        // push 5
        // legs 4

        const twoUnderOneAt = (
          maxed: "legs" | "push" | "pull",
          totals: OPTTotalType,
          freq_limits: MaxSessionsPerSplit,
          prioritySplits: ("push" | "pull" | "legs")[]
        ) => {
          const newTotals = { ...totals };
          const legsDistFromMax =
            freq_limits.legs.max - totals.legs + totals.full;
          const pushDistFromMax =
            freq_limits.push.max - totals.upper + totals.push + totals.full;
          const pullDistFromMax =
            freq_limits.pull.max - totals.upper + totals.pull + totals.full;

          let notExhausted = true;
          switch (maxed) {
            case "legs":
              if (pushDistFromMax >= 2 || pullDistFromMax >= 2) {
                if (pushDistFromMax + 1 < 2 || pullDistFromMax + 1 < 2) {
                  newTotals.legs--;
                  newTotals.upper++;
                  notExhausted = false;
                } else {
                  notExhausted = false;
                }
              } else {
                notExhausted = false;
              }

              if (prioritySplits[0] === "legs") {
                if (pushDistFromMax >= 2 || pullDistFromMax >= 2) {
                  newTotals.legs--;
                  newTotals.upper++;
                } else {
                }
              } else if (prioritizedSplits[1] === "legs") {
              } else {
              }

              if (pushDistFromMax >= 2 || pullDistFromMax >= 2) {
                newTotals.legs--;
                newTotals.upper++;
              } else {
              }
              break;
            case "pull":
              if (prioritySplits[0] === "pull") notExhausted = false;
              if (pushDistFromMax >= 2 || legsDistFromMax >= 2) {
              }
              break;
            case "push":
              if (prioritySplits[0] === "push") notExhausted = false;
              if (pullDistFromMax >= 2 || legsDistFromMax >= 2) {
              }
              break;
            default:
              break;
          }

          return {
            notExhausted: notExhausted,
            totals: newTotals,
          };
        };

        const altHigherThanTar = isSplitHigherPriority(
          tarType,
          altType,
          prioritizedSplits
        );

        if (altHigherThanTar) {
          isNotBroken = false;
        } else {
          if (totals[altType] > 0) {
            totals[altType]--;
            totals.upper++;
          } else {
            totals.upper--;
            totals[tarType]++;
          }
        }
      }
    }
    // LEGS: over max && PUSH || PULL: at max
    else if (legsDistFromMax < 0) {
      if (over_under === "over") {
        if (totals.full > 0) {
          totals.full--;
          totals[altType]++;
        } else {
          totals[tarType]--;
          totals[altType]++;
        }
      } else {
        if (totals.legs > 0) {
          totals.legs--;
          totals[tarType]++;
        } else {
          totals.full--;
          totals.upper++;
        }
      }
    }
    // LEGS: at max && PUSH || PULL: at max
    else {
      if (over_under === "over") {
        if (totals[tarType] > 0) {
          isNotBroken = false;
        } else {
          totals.upper--;
          totals[altType]++;
        }
      } else {
        const altHigherThanTar = isSplitHigherPriority(
          altType,
          tarType,
          prioritizedSplits
        );
        const legsHigherThanTar = isSplitHigherPriority(
          "legs",
          tarType,
          prioritizedSplits
        );
        if (altHigherThanTar) {
          if (legsHigherThanTar) {
            isNotBroken = false;
          } else {
            if (totals.legs > 0) {
              totals.legs--;
              totals[tarType]++;
            } else {
              isNotBroken = false;
            }
          }
        } else {
          if (legsHigherThanTar) {
            if (totals[altType] > 0) {
              totals[altType]--;
              totals.upper++;
            } else {
              isNotBroken = false;
            }
          } else {
            if (totals.legs > 0) {
              totals.legs--;
              totals[tarType]++;
            } else {
              isNotBroken = false;
            }
          }
        }
      }
    }
  }

  console.log(
    _totals,
    totals,
    isNotBroken,
    over_under,
    `${type} DISTRIBUTION AFTER`
  );
  return {
    canAdd: isNotBroken,
    totals: totals,
  };
};

export const legsDistribution = (
  over_under: "over" | "under",
  freq_limits: MaxSessionsPerSplit,
  _totals: OPTTotalType,
  prioritizedSplits: string[]
) => {
  let totals = { ..._totals };

  const pullLimit = freq_limits.pull;
  const pushLimit = freq_limits.push;
  const legsLimit = freq_limits.legs;
  const pullTotal = totals.pull + totals.upper + totals.full;
  const pushTotal = totals.push + totals.upper + totals.full;
  const legsTotal = totals.legs + totals.full;
  const pullDistFromMax = pullLimit.max - pullTotal;
  const pushDistFromMax = pushLimit.max - pushTotal;
  const legsDistFromMax = legsLimit.max - legsTotal;

  let isNotBroken = true;
  console.log(
    _totals,
    totals,
    isNotBroken,
    over_under,
    "LEGS DISTRIBUTION BEFORE"
  );
  if (pushDistFromMax > 0) {
    // LEGS: under | over max && PUSH: under max && PULL under max
    if (pullDistFromMax > 0) {
      if (over_under === "over") {
        totals.legs--;
        totals.upper++;
      } else {
        // NOTE: should probably check distance each is from max
        isNotBroken = false;
      }
    }
    // LEGS: under | over max && PUSH: under max && PULL over max
    else if (pullDistFromMax < 0) {
      if (over_under === "over") {
        if (totals.legs > 0) {
          totals.legs--;
          totals.push++;
        } else {
          totals.full--;
          totals.push++;
        }
      } else {
        if (totals.pull > 0) {
          totals.pull--;
          totals.legs++;
        } else {
          if (isSplitHigherPriority("legs", "push", prioritizedSplits)) {
            totals.upper--;
            totals.legs++;
          } else {
            isNotBroken = false;
          }
        }
      }
    }
    // LEGS: under | over max && PUSH: under max && PULL at max
    else {
      if (over_under === "over") {
        if (totals.legs > 0) {
          totals.legs--;
          totals.push++;
        } else {
          totals.full--;
          totals.upper++;
        }
      } else {
        const higherThanPush = isSplitHigherPriority(
          "legs",
          "push",
          prioritizedSplits
        );
        const higherThanPull = isSplitHigherPriority(
          "legs",
          "pull",
          prioritizedSplits
        );

        if (totals.pull > 0) {
          if (higherThanPull) {
            totals.pull--;
            totals.legs++;
          } else {
            isNotBroken = false;
          }
        } else {
          if (higherThanPull && higherThanPush) {
            totals.upper--;
            totals.legs++;
          } else {
            isNotBroken = false;
          }
        }
      }
    }
  } else if (pushDistFromMax < 0) {
    // LEGS: under | over max && PUSH: over max && PULL under max
    if (pullDistFromMax > 0) {
      if (over_under === "over") {
        totals.legs--;
        totals.pull++;
      } else {
        if (totals.push > 0) {
          totals.push--;
          totals.legs++;
        } else {
          const higherThanPull = isSplitHigherPriority(
            "legs",
            "pull",
            prioritizedSplits
          );
          if (higherThanPull) {
            totals.upper--;
            totals.legs++;
          } else {
            isNotBroken = false;
          }
        }
      }
    }
    // LEGS: under | over max && PUSH: over max && PULL over max
    else if (pullDistFromMax < 0) {
      if (over_under === "over") {
        if (totals.full > 0) {
          totals.full--;
          const pushHigherThanPull = isSplitHigherPriority(
            "push",
            "pull",
            prioritizedSplits
          );
          if (pushHigherThanPull) {
            totals.push++;
          } else {
            totals.pull++;
          }
        } else {
          isNotBroken = false;
        }
      } else {
        totals.upper--;
        totals.legs++;
      }
    }
    // LEGS: under | over max && PUSH: over max && PULL at max
    else {
      if (over_under === "over") {
        if (totals.full > 0) {
          totals.full--;
          totals.pull++;
        } else {
          isNotBroken = false;
        }
      } else {
        if (totals.push > 0) {
          totals.push--;
          totals.legs++;
        } else {
          const higherThanPull = isSplitHigherPriority(
            "legs",
            "pull",
            prioritizedSplits
          );
          if (higherThanPull) {
            totals.upper--;
            totals.legs++;
          } else {
            isNotBroken = false;
          }
        }
      }
    }
  } else {
    // LEGS: under | over max && PUSH: at max && PULL under max
    if (pullDistFromMax > 0) {
      if (over_under === "over") {
        if (totals.legs > 0) {
          totals.legs--;
          totals.pull++;
        } else {
          totals.full--;
          totals.upper++;
        }
      } else {
        const higherThanPull = isSplitHigherPriority(
          "legs",
          "pull",
          prioritizedSplits
        );
        const higherThanPush = isSplitHigherPriority(
          "legs",
          "push",
          prioritizedSplits
        );
        if (
          higherThanPull &&
          higherThanPush &&
          legsDistFromMax > pullDistFromMax
        ) {
          totals.upper--;
          totals.legs++;
        } else {
          isNotBroken = false;
        }
      }
    }
    // LEGS: under | over max && PUSH: at max && PULL over max
    else if (pullDistFromMax < 0) {
      if (over_under === "over") {
        if (totals.legs > 0) {
          isNotBroken = false;
        } else {
          totals.full--;
          totals.push++;
        }
      } else {
        if (totals.pull > 0) {
          totals.pull--;
          totals.legs++;
        } else {
          const higherThanPush = isSplitHigherPriority(
            "legs",
            "push",
            prioritizedSplits
          );
          if (higherThanPush) {
            totals.upper--;
            totals.legs++;
            if (pushLimit.max - 1 === legsTotal + 1) {
              isNotBroken = false;
            }
          } else {
            isNotBroken = false;
          }
        }
      }
    }
    // LEGS: under | over max && PUSH: at max && PULL at max
    else {
      if (over_under === "over") {
        if (totals.legs > 0) {
          isNotBroken = false;
        } else {
          totals.full--;
          totals.upper++;
        }
      } else {
        if (totals.full < 2) {
          totals.upper--;
          totals.full++;
        } else {
          const higherThanPush = isSplitHigherPriority(
            "legs",
            "push",
            prioritizedSplits
          );
          const higherThanPull = isSplitHigherPriority(
            "legs",
            "pull",
            prioritizedSplits
          );
          if (higherThanPush) {
            if (totals.push > 0) {
              totals.push--;
              totals.legs++;
            } else {
              if (higherThanPull) {
                totals.upper--;
                totals.legs++;
              } else {
                isNotBroken = false;
              }
            }
          } else {
            if (higherThanPull) {
              if (totals.pull > 0) {
                totals.pull--;
                totals.legs++;
              } else {
                isNotBroken = false;
              }
            } else {
              isNotBroken = false;
            }
          }
        }
      }
    }
  }

  console.log(
    _totals,
    totals,
    isNotBroken,
    over_under,
    "LEGS DISTRIBUTION BEFORE"
  );
  return {
    canAdd: isNotBroken,
    totals: totals,
  };
};
