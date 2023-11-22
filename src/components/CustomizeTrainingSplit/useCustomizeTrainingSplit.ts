import { useEffect, useState } from "react";
import {
  MusclePriorityType,
  SplitSessionsNameType,
  SplitSessionsType,
  TrainingDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import {
  VolumeLandmarkType,
  getSplitSessions,
  updateReducerStateHandler,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { getEndOfMesocycleVolume } from "~/utils/musclePriorityHandlers";

export default function useCustomizeTrainingSplit(
  _prioritized_muscle_list: MusclePriorityType[],
  total_sessions: [number, number],
  _training_week: TrainingDayType[],
  mrv_breakpoint: number,
  mev_breakpoint: number,
  _split_sessions: SplitSessionsType
) {
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ..._prioritized_muscle_list,
  ]);
  const [splitSessions, setSplitSessions] = useState<SplitSessionsType>({
    ..._split_sessions,
  });
  const [trainingWeek, setTrainingWeek] = useState<TrainingDayType[]>([
    ..._training_week,
  ]);

  const [mrvBreakpoint, setMrvBreakpoint] = useState<number>(mrv_breakpoint);
  const [mevBreakpoint, setMevBreakpoint] = useState<number>(mev_breakpoint);

  const [entireVolume, setEntireVolume] = useState<number>(0);
  const [splitVolume, setSplitVolume] = useState<
    { session: string; sets: number }[]
  >([]);

  useEffect(() => {
    let splits = [];
    let count = 0;
    for (let i = 0; i < musclePriority.length; i++) {
      const totalVolume = getEndOfMesocycleVolume(
        musclePriority[i].muscle,
        musclePriority[i].mesoProgression[2],
        musclePriority[i].volume_landmark
      );
      count = count + totalVolume;
    }
    let total = total_sessions[0] + total_sessions[1];
    let setsPerDay = Math.round(count / total);

    for (let j = 0; j < total; j++) {
      splits.push({ session: `Session ${j + 1}`, sets: setsPerDay });
    }
    setEntireVolume(count);
    setSplitVolume(splits);
  }, [musclePriority]);

  const onVolumeChange = (index: number, newVolume: VolumeLandmarkType) => {
    const items = [...musclePriority];

    let destinationIndex = 0;

    switch (newVolume) {
      case "MRV":
        if (index > mevBreakpoint) {
          destinationIndex = mevBreakpoint - 1;
        } else {
          destinationIndex = mrvBreakpoint - 1;
        }
        break;
      case "MEV":
        if (index < mrvBreakpoint) {
          destinationIndex = mrvBreakpoint;
        } else if (index >= mevBreakpoint) {
          destinationIndex = mevBreakpoint - 1;
        }
        break;
      default:
        destinationIndex = mevBreakpoint;
    }

    const [removed] = items.splice(index, 1);
    items.splice(destinationIndex, 0, removed);

    const updated = updateReducerStateHandler(
      total_sessions,
      items,
      trainingWeek,
      mrvBreakpoint,
      mevBreakpoint,
      _split_sessions
    );

    setMusclePriority(updated.list);
    setTrainingWeek(updated.split);
  };

  const onBreakpointChange = (value: number, other: string) => {
    let _mrvBreakpoint = mrvBreakpoint;
    let _mevBreakpoint = mevBreakpoint;

    let type: "mev_breakpoint" | "mrv_breakpoint" = "mev_breakpoint";
    if (other === "MRV -") {
      _mrvBreakpoint = value;
      type = "mrv_breakpoint";
    } else {
      _mevBreakpoint = value;
    }

    setMrvBreakpoint(_mrvBreakpoint);
    setMevBreakpoint(_mevBreakpoint);

    const updated = updateReducerStateHandler(
      total_sessions,
      musclePriority,
      trainingWeek,
      _mrvBreakpoint,
      _mevBreakpoint,
      _split_sessions
    );
    setMusclePriority(updated.list);
    setTrainingWeek(updated.split);
  };

  type ActualSplitType = {
    lower: number;
    upper: number;
    push: number;
    pull: number;
    full: number;
    off: number;
  };
  const [actualSplit, setActualSplit] = useState<ActualSplitType>();

  const onSplitChange = (type: SplitSessionsNameType) => {
    const splits = getSplitSessions(type, total_sessions, musclePriority);
    const updated = updateReducerStateHandler(
      total_sessions,
      musclePriority,
      trainingWeek,
      mrvBreakpoint,
      mevBreakpoint,
      splits
    );
    // setActualSplit(splits);
    setMusclePriority(updated.list);
    setTrainingWeek(updated.split);
  };

  const updateMesoProgression = (id: string, newMesoProgression: number[]) => {
    const updateList = [...musclePriority].map((each) => {
      if (each.id === id) {
        return { ...each, mesoProgression: newMesoProgression };
      } else return each;
    });
    setMusclePriority(updateList);
  };

  return {
    musclePriority,
    entireVolume,
    splitVolume,
    trainingWeek,
    onVolumeChange,
    onBreakpointChange,
    onSplitChange,
    actualSplit,
    updateMesoProgression,
    mrv_breakpoint,
    mev_breakpoint,
  };
}
