import { useEffect, useState } from "react";
import {
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import {
  VolumeLandmarkType,
  updateReducerStateHandler,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { getEndOfMesocycleVolume } from "~/utils/musclePriorityHandlers";

export default function useCustomizeTrainingSplit(
  _prioritized_muscle_list: MusclePriorityType[],
  total_sessions: [number, number],
  _split: SessionDayType[],
  mrv_breakpoint: number,
  mev_breakpoint: number
) {
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ..._prioritized_muscle_list,
  ]);
  const [split, setSplit] = useState<SessionDayType[]>([..._split]);

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
      split,
      mrvBreakpoint,
      mevBreakpoint
    );

    setMusclePriority(updated.list);
    setSplit(updated.split);
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
      split,
      _mrvBreakpoint,
      _mevBreakpoint
    );
    setMusclePriority(updated.list);
    setSplit(updated.split);
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
    split,
    onVolumeChange,
    onBreakpointChange,
    updateMesoProgression,
    mrv_breakpoint,
    mev_breakpoint,
  };
}
