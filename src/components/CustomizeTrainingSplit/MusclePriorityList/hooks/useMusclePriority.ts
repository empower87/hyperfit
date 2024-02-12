import { useCallback, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import { getMusclesMaxFrequency } from "~/constants/workoutSplits";
import {
  MusclePriorityType,
  SplitSessionsType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import {
  getFrequencyProgression,
  getSetProgressionMatrixForMuscle,
  onReorderUpdateMusclePriorityList,
  onSplitChangeUpdateMusclePriorityList,
  reorderListByVolumeBreakpoints,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";
import { getEndOfMesocycleVolume } from "../utils/getVolumeTotal";

export default function useMusclePriority(
  muscle_priority_list: MusclePriorityType[],
  volume_breakpoints: [number, number],
  split_sessions: SplitSessionsType,
  mesocycles: number,
  microcycles: number
) {
  const [volumeBreakpoints, setVolumeBreakpoints] = useState<[number, number]>([
    ...volume_breakpoints,
  ]);
  const [draggableList, setDraggableList] = useState<MusclePriorityType[]>([
    ...muscle_priority_list,
  ]);

  const getTotalVolumeHandler = useCallback(
    (_frequencyProgression: number[], _muscle: MusclePriorityType) => {
      const { muscle, volume } = _muscle;
      const { exercisesPerSessionSchema, landmark } = volume;
      const matrix = getSetProgressionMatrixForMuscle(
        _frequencyProgression,
        exercisesPerSessionSchema,
        microcycles
      );
      let newVolume: number[] = [];
      for (let i = 0; i < _frequencyProgression.length; i++) {
        const newTotalVolume = getEndOfMesocycleVolume(
          muscle,
          i + 1,
          landmark,
          matrix
        );
        newVolume.push(newTotalVolume);
      }
      return newVolume;
    },
    [microcycles]
  );

  const onFrequencyProgressionUpdate = (
    muscle: MusclePriorityType,
    operator: "add" | "subtract"
  ) => {
    let total = getMusclesMaxFrequency(split_sessions, muscle.muscle);
    let current =
      muscle.volume.frequencyProgression[
        muscle.volume.frequencyProgression.length - 1
      ];

    if (operator === "add") {
      if (current + 1 <= total) {
        current++;
      } else {
        console.log(current, total, "error: can not add more frequency");
      }
    } else {
      if (current - 1 >= 0) {
        current--;
      } else {
        console.log(current, total, "error: can not subtract more frequency");
      }
    }
    const new_frequency = getFrequencyProgression(current, mesocycles);
    const matrix = getSetProgressionMatrixForMuscle(
      new_frequency,
      muscle.volume.exercisesPerSessionSchema,
      microcycles
    );
    const updatedDraggableExercises = draggableList.map((item) => {
      if (item.id === muscle.id) {
        return {
          ...item,
          volume: {
            ...item.volume,
            frequencyProgression: new_frequency,
            setProgressionMatrix: matrix,
          },
        };
      } else return item;
    });
    setDraggableList(updatedDraggableExercises);
  };

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const items = structuredClone(draggableList);
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      const reordered_items = onReorderUpdateMusclePriorityList(
        items,
        volumeBreakpoints
      );
      const updated_list = onSplitChangeUpdateMusclePriorityList(
        reordered_items,
        split_sessions,
        mesocycles,
        microcycles
      );
      setDraggableList(updated_list);
    },
    [draggableList, volumeBreakpoints, split_sessions, mesocycles, microcycles]
  );

  const onFrequencyProgressionChange = useCallback(
    (id: MusclePriorityType["id"], type: "add" | "subtract") => {
      const updatedList = onSplitChangeUpdateMusclePriorityList(
        draggableList,
        split_sessions,
        mesocycles,
        microcycles,
        [id, type]
      );
      setDraggableList(updatedList);
    },
    [draggableList, split_sessions, mesocycles, microcycles]
  );

  const onVolumeLandmarkChange = useCallback(
    (id: MusclePriorityType["id"], volume_landmark: VolumeLandmarkType) => {
      const list = structuredClone(draggableList);
      const index = list.findIndex((item) => item.id === id);
      list[index].volume.landmark = volume_landmark;
      const { newList, newVolumeBreakpoints } =
        reorderListByVolumeBreakpoints(list);
      const updatedList = onSplitChangeUpdateMusclePriorityList(
        newList,
        split_sessions,
        mesocycles,
        microcycles
      );
      console.log(updatedList, "what this look like??");
      setDraggableList(updatedList);
      setVolumeBreakpoints(newVolumeBreakpoints);
    },
    [draggableList, volumeBreakpoints, split_sessions, mesocycles, microcycles]
  );

  // const onVolumeLandmarkChange = useCallback(
  //   (id: MusclePriorityType["id"], volume_landmark: VolumeLandmarkType) => {
  //     const { newList, newVolumeBreakpoints } = onVolumeLandmarkChangeHandler(
  //       id,
  //       volume_landmark,
  //       draggableList,
  //       volumeBreakpoints
  //     );
  //     console.log(newList, newVolumeBreakpoints, "WHAT UP?");
  //     setDraggableList(newList);
  //     setVolumeBreakpoints(newVolumeBreakpoints);
  //   },
  //   [draggableList, volumeBreakpoints]
  // );

  return {
    draggableList,
    volumeBreakpoints,
    setDraggableList,
    onReorder: onDragEnd,
    onVolumeLandmarkChange,
    onFrequencyProgressionChange,
    onFrequencyProgressionUpdate,
    getTotalVolumeHandler,
  };
}
