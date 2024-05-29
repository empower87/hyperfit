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
      const TEST = distributeWeightsIntoSessions(
        programConfig.frequency[0] + programConfig.frequency[1],
        lol
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

export const distributeOverflow_legs = (
  freq_limits: MaxSessionsPerSplit,
  totals: OPTTotalType
) => {
  const pullLimit = freq_limits.pull;
  const pushLimit = freq_limits.push;

  const legsLimit = freq_limits.legs;

  const pullTotal = totals.pull + totals.upper + totals.full;
  const pushTotal = totals.push + totals.upper + totals.full;

  const pushDistFromMax = pushLimit.max - pushTotal;
  const pullDistFromMax = pullLimit.max - pullTotal;
  console.log(totals, "BEFORE OVERFLOW DISTRIBUTION LEGS");

  // PUSH: at max
  if (pushDistFromMax === 0) {
    if (pullDistFromMax === 0) {
      if (totals.full > 0) {
        totals.full--;
        totals.upper++;
      } else {
        // BREAK POINT HERE
      }
    } else if (pullDistFromMax > 0) {
      totals.legs--;
      totals.pull++;
    }
    // PUSH: at max; PULL: over max; LEGS: over max
    else {
      if (totals.full > 0) {
        totals.full--;
        totals.push++;
      } else {
        // BREAK POINT HERE
      }
    }
  }
  // PUSH: under max
  else if (pushDistFromMax > 0) {
    // PUSH: under max; PULL: at max; LEGS: over max
    if (pullDistFromMax === 0) {
      if (totals.legs > 0) {
        totals.legs--;
        totals.push++;
      } else {
        totals.full--;
        totals.upper++;
        // BREAK POINT HERE
      }
    }
    // PUSH: under max; PULL: under max; LEGS: over max
    else if (pullDistFromMax > 0) {
      if (totals.legs > 0) {
        totals.legs--;
        totals.upper++;
      } else {
        totals.full--;
        totals.upper++;
      }
    }
    // PUSH: under max; PULL: over max; LEGS: over max
    else {
      if (totals.full > 0) {
        totals.full--;
        totals.push++;
      } else {
        if (legsLimit.max < pullLimit.max) {
          totals.legs--;
          totals.push++;
        } else {
          // BREAK POINT HERE
        }
      }
    }
  }
  // PUSH: over max
  else {
    // PUSH: over max; PULL: at max; LEGS: over max
    if (pullDistFromMax === 0) {
      if (totals.full > 0) {
        totals.full--;
        totals.upper++;
      } else {
        // BREAK POINT HERE
      }
    }
    // PUSH: over max; PULL: under max; LEGS: over max
    else if (pullDistFromMax > 0) {
      if (totals.legs > 0) {
        totals.legs--;
        totals.pull++;
      } else {
        totals.full--;
        totals.pull++;
      }
    }
    // PUSH: over max; PULL: over max; LEGS: over max
    else {
      // BREAK POINT HERE
    }
  }
  console.log(totals, "AFTER OVERFLOW DISTRIBUTION LEGS");
  return totals;
};
// I HAVE AN OVERFLOW OF PULLS SO I NEED TO SUB A PULL OR UPPER || MAYBE A FULL
export const distributeOverflow_pull = (
  freq_limits: MaxSessionsPerSplit,
  totals: OPTTotalType
) => {
  const pullLimit = freq_limits.pull;
  const pushLimit = freq_limits.push;

  const legsLimit = freq_limits.legs;

  const pullTotal = totals.pull + totals.upper + totals.full;
  const pushTotal = totals.push + totals.upper + totals.full;
  const legsTotal = totals.legs + totals.full;

  const legsDistFromMax = legsLimit.max - legsTotal;
  const pushDistFromMax = pushLimit.max - pushTotal;
  console.log(totals, "BEFORE OVERFLOW DISTRIBUTION");

  // LEGS: at max
  if (legsDistFromMax === 0) {
    // LEGS: at max; PUSH: at max; PULL: over max
    if (pushDistFromMax === 0) {
      if (totals.upper > 0) {
        totals.upper -= 1;
        totals.push += 1;
      }
    }
    // LEGS: at max; PUSH: under max; PULL: over max
    else if (pushDistFromMax > 0) {
      if (totals.pull > 0) {
        totals.pull--;
        totals.push++;
      } else if (totals.upper > 0) {
        totals.upper--;
        totals.push++;
      } else {
        if (legsLimit.max >= pushLimit.max) {
          // BREAK POINT HERE
        } else {
          totals.legs--;
          totals.push++;
        }
      }
    }
    // LEGS: at max; PUSH: over max; PULL: over max
    else {
      // push and pull are overflowing and legs is at max
      if (totals.full > 0) {
        totals.full--;
        totals.legs++;
      } else {
        // BREAK POINT HERE
      }
    }
  }
  // LEGS: under max
  else if (legsDistFromMax > 0) {
    // LEGS: under max; PUSH: at max; PULL: over max
    if (pushDistFromMax === 0) {
      if (totals.pull > 0) {
        totals.pull--;
        totals.legs++;
      } else if (totals.full < 2) {
        totals.full++;
        totals.upper--;
      } else {
        // ASYMMETRY will occur here. So if legs > push
        if (legsLimit.max > pushLimit.max) {
          totals.upper--;
          totals.legs++;
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: under max; PUSH: under max: PULL: over max
    else if (pushDistFromMax > 0) {
      if (totals.pull > 0) {
        totals.pull--;
        if (totals.full < 2) {
          totals.full++;
        } else {
          if (legsLimit.max > pushLimit.max) {
            totals.legs++;
          } else {
            totals.push++;
          }
        }
      } else if (totals.full < 2) {
        totals.upper--;
        totals.full++;
      } else {
        // FULL IS MAXED AND NO PULLS
        if (legsLimit.max > pushLimit.max) {
          totals.upper--;
          totals.legs++;
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: under max; PUSH: over max; PULL: over max
    else {
      totals.upper--;
      totals.legs++;
    }
  }
  // LEGS: over max
  else {
    // LEGS: over max; PUSH: at max; PULL: over max
    if (pushDistFromMax === 0) {
      // BREAK POINT HERE
    }
    // LEGS: over max; PUSH: under max: PULL: over max
    else if (pushDistFromMax > 0) {
      if (totals.full > 0) {
        totals.full--;
        totals.push++;
      } else {
        if (legsLimit.max < pushLimit.max) {
          totals.legs--;
          totals.push++;
        } else if (pushLimit.max > pullLimit.max) {
          if (totals.pull > 0) {
            totals.pull--;
            totals.push++;
          } else {
            // BREAK POINT HERE
          }
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: over max; PUSH: over max; PULL: over max
    else {
      // BREAK POINT HERE
    }
  }
  console.log(totals, "AFTER OVERFLOW DISTRIBUTION");
  return totals;
};

export const distributeOverflow_push = (
  freq_limits: MaxSessionsPerSplit,
  totals: OPTTotalType
) => {
  const pullLimit = freq_limits.pull;
  const pushLimit = freq_limits.push;

  const legsLimit = freq_limits.legs;

  const pullTotal = totals.pull + totals.upper + totals.full;
  const pushTotal = totals.push + totals.upper + totals.full;
  const legsTotal = totals.legs + totals.full;

  const legsDistFromMax = legsLimit.max - legsTotal;
  const pullDistFromMax = pullLimit.max - pullTotal;
  console.log(totals, "BEFORE OVERFLOW DISTRIBUTION PUSH");

  // LEGS: at max
  if (legsDistFromMax === 0) {
    // LEGS: at max; PULL: at max; PUSH: over max
    if (pullDistFromMax === 0) {
      if (totals.upper > 0) {
        totals.upper -= 1;
        totals.pull += 1;
      }
    }
    // LEGS: at max; PULL: under max; PUSH: over max
    else if (pullDistFromMax > 0) {
      if (totals.push > 0) {
        totals.push--;
        totals.pull++;
      } else if (totals.upper > 0) {
        totals.upper--;
        totals.pull++;
      } else {
        if (legsLimit.max >= pullLimit.max) {
          // BREAK POINT HERE
        } else {
          totals.legs--;
          totals.pull++;
        }
      }
    }
    // LEGS: at max; PULL: over max; PUSH: over max
    else {
      // push and pull are overflowing and legs is at max
      if (totals.full > 0) {
        totals.full--;
        totals.legs++;
      } else {
        // BREAK POINT HERE
      }
    }
  }
  // LEGS: under max
  else if (legsDistFromMax > 0) {
    // LEGS: under max; PULL: at max; PUSH: over max
    if (pullDistFromMax === 0) {
      if (totals.push > 0) {
        totals.push--;
        totals.legs++;
      } else if (totals.full < 2) {
        totals.full++;
        totals.upper--;
      } else {
        // ASYMMETRY will occur here. So if legs > push
        if (legsLimit.max > pullLimit.max) {
          totals.upper--;
          totals.legs++;
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: under max; PULL: under max: PUSH: over max
    else if (pullDistFromMax > 0) {
      if (totals.push > 0) {
        totals.push--;
        if (totals.full < 2) {
          totals.full++;
        } else {
          if (legsLimit.max > pullLimit.max) {
            totals.legs++;
          } else {
            totals.pull++;
          }
        }
      } else if (totals.full < 2) {
        totals.upper--;
        totals.full++;
      } else {
        // FULL IS MAXED AND NO PULLS
        if (legsLimit.max > pullLimit.max) {
          totals.upper--;
          totals.legs++;
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: under max; PULL: over max; PUSH: over max
    else {
      totals.upper--;
      totals.legs++;
    }
  }
  // LEGS: over max
  else {
    // LEGS: over max; PULL: at max; PUSH: over max
    if (pullDistFromMax === 0) {
      // BREAK POINT HERE
    }
    // LEGS: over max; PULL: under max: PUSH: over max
    else if (pullDistFromMax > 0) {
      if (totals.full > 0) {
        totals.full--;
        totals.pull++;
      } else {
        if (legsLimit.max < pushLimit.max) {
          totals.legs--;
          totals.pull++;
        } else if (pushLimit.max > pullLimit.max) {
          if (totals.push > 0) {
            totals.push--;
            totals.pull++;
          } else {
            // BREAK POINT HERE
          }
        } else {
          // BREAK POINT HERE
        }
      }
    }
    // LEGS: over max; PULL: over max; PUSH: over max
    else {
      // BREAK POINT HERE
    }
  }
  console.log(totals, "AFTER OVERFLOW DISTRIBUTION PUSH");
  return totals;
};
