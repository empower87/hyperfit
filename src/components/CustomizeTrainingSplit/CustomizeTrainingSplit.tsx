import {
  MusclePriorityType,
  SessionDayType,
  SplitSessionsType,
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
  _split_sessions: SplitSessionsType;
};

export default function CustomizeTrainingSplit({
  _prioritized_muscle_list,
  _total_sessions,
  _training_week,
  _mrv_breakpoint,
  _mev_breakpoint,
  _split_sessions,
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
    _mev_breakpoint,
    _split_sessions
  );

  return (
    <div>
      <div></div>

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

// upper upper full
// upper upper upper lower full
// upper upper upper lower full full

// upper lower full full upper upper
// 3 4 5 upper
// 1 2 3 lower

// back
// triceps
// biceps
// rear delts
// side delts

// back 3-4-5
// 8x exercises
// 1. Lat Prayers
// 2. Single Arm Lat Pulldowns
// 3. Pullovers
// 4. Close-grip Bent Rows
// 5. Pull ups (AMRAP finisher)
// 6. Seated Cable Row (lat-focused)
// 7. Pulldowns
// 8. Lat Prayers (higher reps)

// triceps 3-4-5
// 5x exercises
// 1. Overhead Extensions
// 2. Single Arm extensions
// 3. Incline DB Extensions
// 4. Dips (machine)
// 5.

// side-delts 3-4-5
// 8x exercises
// 1. lateral raise DB
// 2. later raise cable
// 3. cable Y-raise
// 4. machine lateral raise
// 5. lateral raise DB (full rom)
// 6. Seated DB press

// biceps - 2-3-4
// 4x exercises
// 1. Cable curl Single Arm
// 2. Hammer Curl
// 3. Incline DB biceps curl
// 4. Preacher Curl

// rear-delts 2-3-4
// 5x exercises
// 1. cable single arm reverse fly
// 2. reverse fly machine
// 3. cross arm reverse fly cable
// 4. cable single arm reverse fly (higher rep)
