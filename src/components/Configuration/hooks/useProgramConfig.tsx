import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DropResult } from "react-beautiful-dnd";
import { getBroSplit } from "~/constants/workoutSplits";
import {
  distributeSessionsIntoSplits,
  getFrequencyMaxes,
} from "~/hooks/useTrainingProgram/reducer/distributeSessionsIntoSplits";

import {
  BROSessionKeys,
  INITIAL_STATE,
  INITIAL_WEEK,
  State as ProgramConfigState,
  TrainingDayType,
  type MusclePriorityType,
  type SplitSessionsNameType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { trainingBlockMain } from "~/hooks/useTrainingProgram/utils/buildTrainingBlockHandlers";
import { distributeSplitAcrossWeek } from "~/hooks/useTrainingProgram/utils/distributeSplitAcrossTrainingWeek";
import {
  attachTargetFrequency,
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

  const [
    testSessions,
    setTestSessions
  ] = useState<{
    push: number;
    pull: number;
    upper: number;
    legs: number;
    full: number;
  }>({ push: 0, pull: 0, upper: 0, legs: 0, full: 0 });


  useEffect(
    () => {
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

  const onChangeHandler = useCallback(
    (
      total_sessions: [number, number],
      split: SplitSessionsNameType,
      muscle_priority_list: MusclePriorityType[]
    ) => {
      const { mesocycles } = programConfig.training_program_params;
      const total = total_sessions[0] + total_sessions[1];

      const getNGroup = getFrequencyMaxes(
        2, // this will be determined via mrv_breakpoint
        muscle_priority_list,
        volumeBreakpoints,
        total
      );

      const broSplitSorted =
        split === "BRO"
          ? muscle_priority_list.reduce((acc: BROSessionKeys[], curr) => {
              const split = getBroSplit(curr.muscle);
              if (!acc.includes(split)) return [...acc, split];
              return acc;
            }, [])
          : undefined;

      const freq_list = attachTargetFrequency(
        muscle_priority_list,
        total,
        volumeBreakpoints
      );

      const reordered_items = onReorderUpdateMusclePriorityList(
        freq_list,
        volumeBreakpoints
      );

      const new_split_sessions = distributeSessionsIntoSplits(
        split,
        total,
        getNGroup,
        broSplitSorted
      );

      const new_training_week = distributeSplitAcrossWeek(
        total_sessions,
        new_split_sessions
      );
      const TESTIES = trainingBlockMain(
        new_split_sessions,
        reordered_items,
        new_training_week,
        total
      );

      console.log(reordered_items, "Checking the muscle priority list");
      setProgramConfig((prev) => ({
        ...prev,
        frequency: total_sessions,
        split_sessions: new_split_sessions,
        training_week: new_training_week,
        muscle_priority_list: reordered_items,
      }));
    },
    [programConfig, volumeBreakpoints]
  );

  const onFrequencyChange = useCallback(
    (values: [number, number]) => {
      const { split_sessions, muscle_priority_list } = programConfig;
      onChangeHandler(values, split_sessions.split, muscle_priority_list);
    },
    [programConfig]
  );

  const onSplitChange = useCallback(
    (split: SplitSessionsNameType) => {
      const remove = window.localStorage.removeItem("TRAINING_PROGRAM_STATE");
      const { frequency, muscle_priority_list } = programConfig;

      onChangeHandler(frequency, split, muscle_priority_list);
    },
    [programConfig, onChangeHandler]
  );

  // 2full -
  //                    back ---6upper
  //                    back ---6upper
  //                    delts_side ---5upper
  //                    delts_side ---5upper
  //                    biceps ---5upper

  // 3upper -
  //        back
  //        back
  //        delts_side
  //        delts_side
  //        delts_rear
  //        traps
  //        chest
  //        chest

  // 5upper -
  //        back
  //        back
  //  DELTS_SIDE ---2full
  //  DELTS_SIDE ---2full
  //        triceps
  //        delts_rear
  //        traps
  //  BICEPS ---2full

  // 6upper -
  //  BACK ---2full
  //  BACK ---2full
  //        delts_side
  //        delts_side
  //        triceps
  //        forearms
  //        biceps

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
      const { frequency, muscle_priority_list, split_sessions } = programConfig;

      const items = [...muscle_priority_list];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      onChangeHandler(frequency, split_sessions.split, items);
    },
    [programConfig, volumeBreakpoints, onChangeHandler]
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
  };
}

type ProgramConfigType = ReturnType<typeof useProgramConfig>;

const ProgramConfigContext = createContext<ProgramConfigType>({
  muscle_priority_list: INITIAL_STATE.muscle_priority_list,
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

