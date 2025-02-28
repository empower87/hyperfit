import { useCallback, useEffect, useRef, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
import {
  MusclePriorityType,
  SplitSessionsNameType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { MUSCLE_PRIORITY_LIST } from "~/hooks/useTrainingProgram/utils/prioritized_muscle_list/musclePriorityListHandlers";

type UseProgramSettingsProps = {
  onSaveSettings: (settings: {
    total_frequency: [number, number];
    split: SplitSessionsNameType;
    muscle_priority_list: MusclePriorityType[];
    breakpoints: [number, number];
  }) => void;
};

export function useProgramSettings({
  onSaveSettings,
}: UseProgramSettingsProps) {
  const [volumeLandmarkBreakpoints, setVolumeLandmarkBreakpoints] = useState<
    [number, number]
  >([4, 9]);
  const [musclePrioritization, setMusclePrioritization] = useState<
    MusclePriorityType[]
  >([...MUSCLE_PRIORITY_LIST]);
  const [frequency, setFrequency] = useState<[number, number]>([3, 0]);
  const [split, setSplit] = useState<SplitSessionsNameType>("OPT");

  const [dragNdropResults, setDragNdropResults] = useState<{
    source: number;
    destination: number;
  } | null>(null);

  const musclePrioritizationRef = useRef<MusclePriorityType[]>([
    ...MUSCLE_PRIORITY_LIST,
  ]);
  const frequencyRef = useRef<[number, number]>([3, 0]);
  const splitRef = useRef<SplitSessionsNameType>("OPT");
  const volumeLandmarkBreakpointsRef = useRef<[number, number]>([4, 9]);

  useEffect(() => {
    if (dragNdropResults) {
      const { source, destination } = dragNdropResults;
      const items = structuredClone(musclePrioritization);
      const [removed] = items.splice(source, 1);
      items.splice(destination, 0, removed);
      setMusclePrioritization(items);
      setDragNdropResults(null);
    }
  }, [dragNdropResults]);

  const onPriorityListDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    setDragNdropResults({
      source: result.source.index,
      destination: result.destination.index,
    });
  };

  const onSplitChange = (split: SplitSessionsNameType) => {
    setSplit(split);
  };

  const onFrequencyChange = (value: [number, number]) => {
    setFrequency(value);
  };

  const onSaveProgramSettings = useCallback(() => {
    const settings = {
      total_frequency: frequencyRef.current,
      split: splitRef.current,
      muscle_priority_list: musclePrioritizationRef.current,
      breakpoints: volumeLandmarkBreakpointsRef.current,
    };
    console.log(settings, "WTF IS WRONG HERE?");
    onSaveSettings(settings);
  }, []);

  // const onSaveProgramSettings = useCallback(() => {
  //   const settings = {
  //     total_frequency: frequency,
  //     split: split,
  //     muscle_priority_list: musclePrioritization,
  //     breakpoints: volumeLandmarkBreakpoints,
  //   };
  //   console.log(settings, "WTF IS WRONG HERE?");
  //   onSaveSettings(settings);
  // }, [musclePrioritization, split, frequency, volumeLandmarkBreakpoints]);

  return {
    musclePrioritization,
    split,
    frequency,
    onPriorityListDragEnd,
    onSplitChange,
    onFrequencyChange,
    onSaveProgramSettings,
    musclePrioritizationRef,
    frequencyRef,
    splitRef,
    volumeLandmarkBreakpointsRef,
  };
}
