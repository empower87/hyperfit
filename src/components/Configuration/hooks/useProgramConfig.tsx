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
} from "~/hooks/useTrainingProgram/utils/split_sessions/distributeSessionsIntoSplits";

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
import {
  attachTargetFrequency,
  reorderListByVolumeBreakpoints,
} from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";
import { distributeSplitAcrossWeek } from "~/hooks/useTrainingProgram/utils/training_block/distributeSplitAcrossTrainingWeek";
import { initializeTrainingBlock } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";

const restructureProgramConfig = (
  total_sessions: [number, number],
  split: SplitSessionsNameType,
  muscle_priority_list: MusclePriorityType[],
  mesocycles: number,
  breakpoints: [number, number]
) => {
  // const { mesocycles } = programConfig.training_program_params;
  const total = total_sessions[0] + total_sessions[1];

  const reordered_items = attachTargetFrequency(
    muscle_priority_list,
    total,
    breakpoints,
    mesocycles
  );

  // seems to be a problem here
  const getNGroup = getFrequencyMaxes(
    2, // this will be determined via mrv_breakpoint
    reordered_items,
    breakpoints,
    total
  );

  const broSplitSorted =
    split === "BRO"
      ? reordered_items.reduce((acc: BROSessionKeys[], curr) => {
          const split = getBroSplit(curr.muscle);
          if (!acc.includes(split)) return [...acc, split];
          return acc;
        }, [])
      : undefined;

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
  const new_training_block = initializeTrainingBlock(
    new_split_sessions,
    reordered_items,
    new_training_week,
    total,
    mesocycles
  );

  console.log(
    total_sessions,
    getNGroup,
    reordered_items,
    new_training_block[new_training_block.length - 1],
    "OK LETS CHECK THESE"
  );
  return {
    frequency: total_sessions,
    split_sessions: new_split_sessions,
    training_block: new_training_block,
    muscle_priority_list: reordered_items,
    mrv_breakpoint: breakpoints[0],
    mev_breakpoint: breakpoints[1],
  };
};

function useProgramConfig() {
  const {
    prioritized_muscle_list,
    mrv_breakpoint,
    mev_breakpoint,
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

  useEffect(() => {
    const remove = window.localStorage.removeItem("TRAINING_PROGRAM_STATE");
    setProgramConfig({
      muscle_priority_list: prioritized_muscle_list,
      mrv_breakpoint: mrv_breakpoint,
      mev_breakpoint: mev_breakpoint,
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
    split_sessions,
    training_program_params,
    training_block,
  ]);

  const onFrequencyChange = useCallback(
    (values: [number, number]) => {
      const {
        split_sessions,
        muscle_priority_list,
        training_program_params,
        mev_breakpoint,
        mrv_breakpoint,
      } = programConfig;

      const updated = restructureProgramConfig(
        values,
        split_sessions.split,
        muscle_priority_list,
        training_program_params.mesocycles,
        [mrv_breakpoint, mev_breakpoint]
      );
      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        split_sessions: updated.split_sessions,
        muscle_priority_list: updated.muscle_priority_list,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mev_breakpoint,
      }));
    },
    [programConfig]
  );

  const onSplitChange = useCallback(
    (split: SplitSessionsNameType) => {
      // const remove = window.localStorage.removeItem("TRAINING_PROGRAM_STATE");
      const { frequency, muscle_priority_list, training_program_params } =
        programConfig;
      const mesocyles = training_program_params.mesocycles;
      const volumeBreakpoints: [number, number] = [
        mrv_breakpoint,
        mev_breakpoint,
      ];
      // onChangeHandler(frequency, split, muscle_priority_list);
      const updated = restructureProgramConfig(
        frequency,
        split,
        muscle_priority_list,
        mesocyles,
        volumeBreakpoints
      );
      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        split_sessions: updated.split_sessions,
        muscle_priority_list: updated.muscle_priority_list,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mev_breakpoint,
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
      const { frequency, muscle_priority_list, training_program_params } =
        programConfig;
      const mesocyles = training_program_params.mesocycles;
      const volumeBreakpoints: [number, number] = [
        mrv_breakpoint,
        mev_breakpoint,
      ];

      const items = structuredClone(muscle_priority_list);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      // onChangeHandler(frequency, split_sessions.split, items);
      const updated = restructureProgramConfig(
        frequency,
        split_sessions.split,
        items,
        mesocyles,
        volumeBreakpoints
      );
      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        split_sessions: updated.split_sessions,
        muscle_priority_list: updated.muscle_priority_list,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mev_breakpoint,
      }));
    },
    [programConfig]
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
      const {
        frequency,
        muscle_priority_list,
        training_program_params,
        mrv_breakpoint,
        mev_breakpoint,
      } = programConfig;
      const mesocyles = training_program_params.mesocycles;

      const new_breakpoints: [number, number] = [
        mrv_breakpoint,
        mev_breakpoint,
      ];
      const index = type === "MRV" ? 0 : 1;
      new_breakpoints[index] = value;

      const updated = restructureProgramConfig(
        frequency,
        split_sessions.split,
        muscle_priority_list,
        mesocyles,
        new_breakpoints
      );
      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        split_sessions: updated.split_sessions,
        muscle_priority_list: updated.muscle_priority_list,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mev_breakpoint,
      }));
    },
    [programConfig]
  );

  const onToggleBreakpoints = useCallback(
    (type: "All MEV" | "All MV") => {
      const {
        frequency,
        muscle_priority_list,
        training_program_params,
        mrv_breakpoint,
        mev_breakpoint,
      } = programConfig;
      const mesocyles = training_program_params.mesocycles;
      const new_breakpoints: [number, number] = [
        mrv_breakpoint,
        mev_breakpoint,
      ];

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

      const updated = restructureProgramConfig(
        frequency,
        split_sessions.split,
        muscle_priority_list,
        mesocyles,
        new_breakpoints
      );
      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        split_sessions: updated.split_sessions,
        muscle_priority_list: updated.muscle_priority_list,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mev_breakpoint,
      }));
    },
    [programConfig]
  );

  const onResetConfig = useCallback(() => {
    setProgramConfig({
      muscle_priority_list: prioritized_muscle_list,
      mrv_breakpoint: mrv_breakpoint,
      mev_breakpoint: mev_breakpoint,
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
    split_sessions,
    training_program_params,
    training_block,
  ]);

  const onSaveConfig = useCallback(() => {
    handleOnProgramConfigChange({ ...programConfig });
  }, [programConfig]);

  return {
    muscle_priority_list: programConfig.muscle_priority_list,
    volumeBreakpoints,
    trainingWeek:
      programConfig.training_block[programConfig.training_block.length - 1],
    split_sessions: programConfig.split_sessions,
    training_program_params: programConfig.training_program_params,
    frequency: programConfig.frequency,
    split: programConfig.split_sessions.split,
    onSaveConfig,
    onResetConfig,
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
  onResetConfig: () => null,
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
