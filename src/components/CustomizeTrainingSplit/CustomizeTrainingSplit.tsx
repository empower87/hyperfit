import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useTrainingProgram from "~/hooks/useTrainingProgram/useTrainingProgram";
import { TrainingDayType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import useWeeklySessionSplit from "~/hooks/useWeeklySessionSplit/useWeeklySessionSplit";
import { getEndOfMesocycleVolume } from "~/utils/musclePriorityHandlers";
import WeekSessions from "./ExerciseSelection/ExerciseSelection";
import { MusclePriorityList } from "./MusclePriorityList/MusclePriorityList";
import SelectFrequencySplit from "./Settings/SelectFrequencySplit";
import { ListVolumeSettings, WeekVolumeDetails } from "./Settings/Settings";
import WeekOverview from "./WeekOverview/WeekOverview";

type CustomizeTrainingSplitProps = {
  setTrainingWeek: Dispatch<SetStateAction<TrainingDayType[]>>;
};

export default function CustomizeTrainingSplit({
  setTrainingWeek,
}: CustomizeTrainingSplitProps) {
  const {
    training_week,
    split_sessions,
    total_sessions,
    mrv_breakpoint,
    mev_breakpoint,
    prioritized_muscle_list,
    handleUpdateMuscleList,
    handleFrequencyChange,
    handleUpdateSplitSessions,
    handleUpdateBreakpoint,
  } = useWeeklySessionSplit();

  const data = useTrainingProgram();
  /// added for test
  const [entireVolume, setEntireVolume] = useState<number>(0);
  const [splitVolume, setSplitVolume] = useState<
    { session: string; sets: number }[]
  >([]);

  useEffect(() => {
    setTrainingWeek(training_week);
  }, [training_week]);

  useEffect(() => {
    let splits = [];
    let count = 0;
    for (let i = 0; i < prioritized_muscle_list.length; i++) {
      const totalVolume = getEndOfMesocycleVolume(
        prioritized_muscle_list[i].muscle,
        prioritized_muscle_list[i].mesoProgression[2],
        prioritized_muscle_list[i].volume_landmark
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
  }, [prioritized_muscle_list]);

  const onVolumeChange = () => {};
  const updateMesoProgression = () => {};

  return (
    <div>
      <div className=" flex w-full">
        <SelectFrequencySplit
          onFrequencyChange={handleFrequencyChange}
          onSplitChange={handleUpdateSplitSessions}
          currentSplit={split_sessions.name}
        />
      </div>

      <div className=" mb-2 flex">
        <div className=" w-1/4 pr-2">
          <ListVolumeSettings
            mrvBreakpoint={mrv_breakpoint}
            mevBreakpoint={mev_breakpoint}
            onBreakpointChange={handleUpdateBreakpoint}
          />
          <WeekVolumeDetails
            entireVolume={entireVolume}
            splitVolume={splitVolume}
          />
          {/* <SplitOverview onSplitChange={handleUpdateSplitSessions} /> */}
        </div>

        <MusclePriorityList
          musclePriority={prioritized_muscle_list}
          onVolumeChange={onVolumeChange}
          total_sessions={total_sessions}
          onMesoProgressionUpdate={updateMesoProgression}
          onPriorityChange={handleUpdateMuscleList}
        />
      </div>

      <WeekOverview
        split_sessions={split_sessions}
        training_week={training_week}
        list={prioritized_muscle_list}
        total_sessions={total_sessions}
      />

      <div>
        <WeekSessions training_week={training_week} />
      </div>
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
// 5. Pull ups (AMRAP finisher | assisted)
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
