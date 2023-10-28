import {
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { MusclePriority } from "../MusclePriority/MusclePriority";
import TrainingSplit from "../TrainingSplit/TrainingSplit";
import useCustomizeTrainingSplit from "./useCustomizeTrainingSplit";

type CustomizeTrainingSplitProps = {
  prioritized_muscle_list: MusclePriorityType[];
  total_sessions: [number, number];
  split: SessionDayType[];
};
export default function CustomizeTrainingSplit({
  prioritized_muscle_list,
  total_sessions,
  split,
}: CustomizeTrainingSplitProps) {
  const data = useCustomizeTrainingSplit(
    prioritized_muscle_list,
    total_sessions,
    split,
    4,
    9
  );

  return (
    <div>
      <MusclePriority
        musclePriority={data.musclePriority}
        total_sessions={data.total_sessions}
        onBreakpointChange={data.onBreakpointChange}
        onVolumeChange={data.onVolumeChange}
        mrvBreakpoint={data.mrv_breakpoint}
        mevBreakpoint={data.mev_breakpoint}
        entireVolume={data.entireVolume}
        splitVolume={data.splitVolume}
      />

      <TrainingSplit
        split={data.split}
        list={data.musclePriority}
        total_sessions={data.total_sessions}
      />
    </div>
  );
}
