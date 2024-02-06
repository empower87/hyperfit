import { useCallback, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  MusclePriorityType,
  SplitSessionsType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import {
  onReorderUpdateMusclePriorityList,
  onSplitChangeUpdateMusclePriorityList,
  reorderListByVolumeBreakpoints,
} from "~/hooks/useTrainingProgram/utils/musclePriorityListHandlers";

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

  const onDragEnd = useCallback(
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
    [draggableList]
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
      const list = [...draggableList];
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
  };
}
