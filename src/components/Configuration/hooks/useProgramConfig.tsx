import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DropResult } from "react-beautiful-dnd";
import { getSplitFromWeights } from "~/hooks/useTrainingProgram/reducer/getSplitFromPriorityWeighting";
import { distributeSplitAcrossWeek } from "~/hooks/useTrainingProgram/reducer/splitSessionsHandler";
import {
  INITIAL_STATE,
  INITIAL_WEEK,
  MusclePriorityType,
  State as ProgramConfigState,
  SplitSessionsNameType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import {
  onReorderUpdateMusclePriorityList,
  reorderListByVolumeBreakpoints,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { onRearrangeTrainingWeek } from "~/hooks/useTrainingProgram/utils/traininingWeekHandlers";

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

  useEffect(() => {
    const new_training_week = distributeSplitAcrossWeek(
      frequency,
      split_sessions
    );
    setProgramConfig({
      muscle_priority_list: prioritized_muscle_list,
      mrv_breakpoint: mrv_breakpoint,
      mev_breakpoint: mev_breakpoint,
      training_week: new_training_week,
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
      const { frequency, muscle_priority_list } = programConfig;
      const new_split_sessions = getSplitFromWeights(
        frequency,
        muscle_priority_list,
        split
      );
      const new_training_week = distributeSplitAcrossWeek(
        frequency,
        new_split_sessions
      );
      console.log(new_split_sessions, new_training_week, "ARE THESE CHANGING?");
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
      const updated_week = onRearrangeTrainingWeek(
        rearranged_week,
        programConfig.split_sessions
      );
      // NOTE: updates training week's isTrainingDay boolean on UI change.
      //       may not need this boolean, but instead just check sessions.length
      //       to determine if a day is a training day or not.
      const revised_training_week = updated_week.map((each) => {
        const sessions = each.sessions.map((ea) => ea.split);
        let isTrainingDay = true;
        if (sessions.length === 0) {
          isTrainingDay = false;
        }
        return {
          ...each,
          isTrainingDay,
        };
      });
      // setTrainingWeek(revised_training_week);
      setProgramConfig((prev) => ({
        ...prev,
        training_week: revised_training_week,
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
    } = programConfig;
    handleOnProgramConfigChange(
      frequency,
      split_sessions.split,
      muscle_priority_list,
      training_program_params
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
