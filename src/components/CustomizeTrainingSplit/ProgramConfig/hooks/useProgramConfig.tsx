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
  SplitSessionsNameType,
  SplitSessionsType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { onReorderUpdateMusclePriorityList } from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { onRearrangeTrainingWeek } from "~/hooks/useTrainingProgram/utils/traininingWeekHandlers";

function useProgramConfig() {
  const {
    prioritized_muscle_list,
    training_week,
    split_sessions,
    training_program_params,
    frequency,
    mrv_breakpoint,
    mev_breakpoint,
    handleOnProgramConfigChange,
  } = useTrainingProgramContext();
  const [volumeBreakpoints, setVolumeBreakpoints] = useState<[number, number]>([
    mrv_breakpoint,
    mev_breakpoint,
  ]);
  const [draggableList, setDraggableList] = useState<MusclePriorityType[]>([
    ...prioritized_muscle_list,
  ]);
  const [trainingWeek, setTrainingWeek] = useState<TrainingDayType[]>([
    ...training_week,
  ]);
  const [split, setSplit] = useState<SplitSessionsNameType>(
    split_sessions.split
  );
  const [splitSessions, setSplitSessions] = useState<SplitSessionsType>({
    ...split_sessions,
  });
  const [programParams, setProgramParams] = useState({
    ...training_program_params,
  });
  const [freq, setFreq] = useState<[number, number]>([...frequency]);

  const onFrequencyChange = useCallback((values: [number, number]) => {
    setFreq(values);
  }, []);

  const onSplitChange = useCallback((split: SplitSessionsNameType) => {
    setSplit(split);
  }, []);

  useEffect(() => {
    const new_split_sessions = getSplitFromWeights(freq, draggableList, split);
    setSplitSessions(new_split_sessions);
  }, [draggableList, freq, split]);

  useEffect(() => {
    const new_training_week = distributeSplitAcrossWeek(
      [...INITIAL_WEEK],
      freq,
      splitSessions
    );
    setTrainingWeek(new_training_week);
  }, [freq, splitSessions]);

  const onRearrangedWeek = useCallback(
    (rearranged_week: TrainingDayType[]) => {
      const updated_week = onRearrangeTrainingWeek(
        rearranged_week,
        splitSessions
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
      setTrainingWeek(revised_training_week);
    },
    [splitSessions]
  );

  const onPriorityListDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const items = [...draggableList];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        volumeBreakpoints
      );

      setDraggableList(reordered_items);
    },
    [draggableList, volumeBreakpoints]
  );

  const onBreakpointChange = useCallback(
    (type: "MRV" | "MEV", value: number) => {
      const new_breakpoints: [number, number] = [...volumeBreakpoints];
      const index = type === "MRV" ? 0 : 1;
      new_breakpoints[index] = value;
      setVolumeBreakpoints(new_breakpoints);

      const items = [...draggableList];
      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        new_breakpoints
      );
      setDraggableList(reordered_items);
    },
    [volumeBreakpoints, draggableList]
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
      const items = [...draggableList];
      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        new_breakpoints
      );
      setDraggableList(reordered_items);
    },
    [volumeBreakpoints, draggableList]
  );

  const onSaveConfig = useCallback(() => {
    handleOnProgramConfigChange(freq, split, draggableList, programParams);
  }, [freq, split, draggableList, programParams]);

  return {
    muscle_priority_list: draggableList,
    volumeBreakpoints,
    trainingWeek,
    split_sessions: splitSessions,
    training_program_params: programParams,
    frequency: freq,
    split,
    onSaveConfig,
    onSplitChange,
    onFrequencyChange,
    onPriorityListDragEnd,
    onBreakpointChange,
    onToggleBreakpoints,
    onRearrangedWeek,
  };
}

type ProgramConfigType = ReturnType<typeof useProgramConfig>;

const ProgramConfigContext = createContext<ProgramConfigType>({
  muscle_priority_list: INITIAL_STATE.muscle_priority_list,
  volumeBreakpoints: [4, 9],
  trainingWeek: [...INITIAL_WEEK],
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
