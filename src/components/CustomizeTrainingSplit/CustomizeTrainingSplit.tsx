import {
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import TrainingSplit from "../TrainingSplit/TrainingSplit";
import { MusclePriorityList } from "./MusclePriorityList/MusclePriorityList";
import { ListVolumeSettings, WeekVolumeDetails } from "./Settings/Settings";
import useCustomizeTrainingSplit from "./useCustomizeTrainingSplit";

type CustomizeTrainingSplitProps = {
  _prioritized_muscle_list: MusclePriorityType[];
  _total_sessions: [number, number];
  _split: SessionDayType[];
  _mrv_breakpoint: number;
  _mev_breakpoint: number;
};
export default function CustomizeTrainingSplit({
  _prioritized_muscle_list,
  _total_sessions,
  _split,
  _mrv_breakpoint,
  _mev_breakpoint,
}: CustomizeTrainingSplitProps) {
  const {
    musclePriority,
    split,
    mrv_breakpoint,
    mev_breakpoint,
    entireVolume,
    splitVolume,
    onBreakpointChange,
    onVolumeChange,
  } = useCustomizeTrainingSplit(
    _prioritized_muscle_list,
    _total_sessions,
    _split,
    _mrv_breakpoint,
    _mev_breakpoint
  );

  return (
    <div>
      <div className=" mb-2 flex">
        <div className=" w-1/4 pr-2">
          <ListVolumeSettings
            mrvBreakpoint={mrv_breakpoint}
            mevBreakpoint={mev_breakpoint}
            onBreakpointChange={onBreakpointChange}
          />

          <WeekVolumeDetails
            entireVolume={entireVolume}
            splitVolume={splitVolume}
          />
        </div>

        <MusclePriorityList
          musclePriority={musclePriority}
          onVolumeChange={onVolumeChange}
          total_sessions={_total_sessions}
        />
      </div>

      <TrainingSplit
        split={split}
        list={musclePriority}
        total_sessions={_total_sessions}
      />
    </div>
  );
}
