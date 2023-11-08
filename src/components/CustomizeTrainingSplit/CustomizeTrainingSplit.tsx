import {
  MusclePriorityType,
  SessionDayType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import TrainingSplit from "../TrainingSplit/TrainingSplit";
import { MusclePriorityList } from "./MusclePriorityList/MusclePriorityList";
import { ListVolumeSettings, WeekVolumeDetails } from "./Settings/Settings";
import SplitOverview from "./Settings/SplitOverview";
import useCustomizeTrainingSplit from "./useCustomizeTrainingSplit";

type CustomizeTrainingSplitProps = {
  _prioritized_muscle_list: MusclePriorityType[];
  _total_sessions: [number, number];
  _training_week: SessionDayType[];
  _mrv_breakpoint: number;
  _mev_breakpoint: number;
};

export default function CustomizeTrainingSplit({
  _prioritized_muscle_list,
  _total_sessions,
  _training_week,
  _mrv_breakpoint,
  _mev_breakpoint,
}: CustomizeTrainingSplitProps) {
  const {
    musclePriority,
    trainingWeek,
    mrv_breakpoint,
    mev_breakpoint,
    entireVolume,
    splitVolume,
    onBreakpointChange,
    onVolumeChange,
    onSplitChange,
    actualSplit,
    updateMesoProgression,
  } = useCustomizeTrainingSplit(
    _prioritized_muscle_list,
    _total_sessions,
    _training_week,
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
            actualSplit={actualSplit}
          />
          <SplitOverview
            total_sessions={_total_sessions}
            onSplitChange={onSplitChange}
            actualSplit={actualSplit}
          />
        </div>

        <MusclePriorityList
          musclePriority={musclePriority}
          onVolumeChange={onVolumeChange}
          total_sessions={_total_sessions}
          onMesoProgressionUpdate={updateMesoProgression}
        />
      </div>

      <TrainingSplit
        training_week={trainingWeek}
        list={musclePriority}
        total_sessions={_total_sessions}
      />
    </div>
  );
}
