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
  INITIAL_STATE,
  INITIAL_WEEK,
  State as ProgramConfigState,
  TrainingDayType,
  type MusclePriorityType,
  type SplitSessionsNameType,
  type VolumeLandmarkType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { adjustBreakpoints } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";
import { trainingProgramHandler } from "~/hooks/useTrainingProgram/utils/trainingProgramHandler";

function useProgramConfig() {
  const tpc = useTrainingProgramContext();

  const [programConfig, setProgramConfig] = useState<ProgramConfigState>({
    ...INITIAL_STATE,
  });

  useEffect(() => {
    const remove = window.localStorage.removeItem("TRAINING_PROGRAM_STATE");
    setProgramConfig({
      muscle_priority_list: tpc.prioritized_muscle_list,
      mrv_breakpoint: tpc.mrv_breakpoint,
      mev_breakpoint: tpc.mev_breakpoint,
      split_sessions: tpc.split_sessions,
      training_program_params: tpc.training_program_params,
      frequency: tpc.frequency,
      training_block: tpc.training_block,
    });
  }, [tpc]);

  const onFrequencyChange = useCallback(
    (values: [number, number]) => {
      const {
        split_sessions,
        muscle_priority_list,
        training_program_params,
        mev_breakpoint,
        mrv_breakpoint,
      } = programConfig;

      const updated = trainingProgramHandler(
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
      const {
        frequency,
        muscle_priority_list,
        training_program_params,
        mev_breakpoint,
        mrv_breakpoint,
      } = programConfig;
      const mesocyles = training_program_params.mesocycles;

      const updated = trainingProgramHandler(
        frequency,
        split,
        muscle_priority_list,
        mesocyles,
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
      const {
        frequency,
        muscle_priority_list,
        split_sessions,
        training_program_params,
        mrv_breakpoint,
        mev_breakpoint,
      } = programConfig;
      const mesocyles = training_program_params.mesocycles;

      const items = structuredClone(muscle_priority_list);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);

      const updated = trainingProgramHandler(
        frequency,
        split_sessions.split,
        items,
        mesocyles,
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

  const onSelectVolumeLandmarkChange = useCallback(
    (id: MusclePriorityType["id"], volume_landmark: VolumeLandmarkType) => {
      const {
        frequency,
        muscle_priority_list,
        split_sessions,
        mrv_breakpoint,
        mev_breakpoint,
        training_program_params,
      } = programConfig;
      // NOTE: worked until i added trainingProgramHandler so need to tweak it for that
      let volumeBreakpoints: [number, number] = [
        mrv_breakpoint,
        mev_breakpoint,
      ];
      const list = structuredClone(muscle_priority_list);
      const index = list.findIndex((item) => item.id === id);
      const currentVolumeLandmark = list[index].volume.landmark;
      list[index].volume.landmark = volume_landmark;
      volumeBreakpoints = adjustBreakpoints(
        currentVolumeLandmark,
        volume_landmark,
        volumeBreakpoints
      );
      const destinationIndex =
        volume_landmark === "MRV"
          ? volumeBreakpoints[0]
          : volume_landmark === "MEV"
          ? volumeBreakpoints[1] - 1
          : volumeBreakpoints[1];
      const [removed] = list.splice(index, 1);
      list.splice(destinationIndex, 0, removed);

      console.log(
        volumeBreakpoints,
        [mrv_breakpoint, mev_breakpoint],
        list,
        "lol weird convolution"
      );
      const updated = trainingProgramHandler(
        frequency,
        split_sessions.split,
        list,
        training_program_params.mesocycles,
        volumeBreakpoints
      );

      setProgramConfig((prev) => ({
        ...prev,
        frequency: updated.frequency,
        muscle_priority_list: updated.muscle_priority_list,
        split_sessions: updated.split_sessions,
        training_block: updated.training_block,
        mrv_breakpoint: updated.mrv_breakpoint,
        mev_breakpoint: updated.mrv_breakpoint,
      }));
    },
    [programConfig]
  );

  const onBreakpointChange = useCallback(
    (type: "MRV" | "MEV", value: number) => {
      const {
        frequency,
        muscle_priority_list,
        training_program_params,
        split_sessions,
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

      const updated = trainingProgramHandler(
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
        split_sessions,
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

      const updated = trainingProgramHandler(
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
      muscle_priority_list: tpc.prioritized_muscle_list,
      mrv_breakpoint: tpc.mrv_breakpoint,
      mev_breakpoint: tpc.mev_breakpoint,
      split_sessions: tpc.split_sessions,
      training_program_params: tpc.training_program_params,
      frequency: tpc.frequency,
      training_block: tpc.training_block,
    });
  }, [tpc]);

  const onSaveConfig = useCallback(() => {
    tpc.handleOnProgramConfigChange({ ...programConfig });
  }, [programConfig]);

  return {
    muscle_priority_list: programConfig.muscle_priority_list,
    volumeBreakpoints: [
      programConfig.mrv_breakpoint,
      programConfig.mev_breakpoint,
    ],
    trainingWeek:
      programConfig.training_block[programConfig.training_block.length - 1],
    trainingBlock: programConfig.training_block,
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
  trainingBlock: [],
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
