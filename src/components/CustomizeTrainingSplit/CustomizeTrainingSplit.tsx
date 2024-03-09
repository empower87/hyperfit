import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { SectionXL as Section } from "../Layout/Sections";
import TrainingBlock from "../Macrocycle/TrainingBlock/TrainingBlock";
import ExerciseOverview from "./ExerciseSelection/ExerciseSelection";
import { MusclePriorityList } from "./MusclePriorityList/MusclePriorityList";
import ProgramConfig from "./ProgramConfig/ProgramConfig";
import { ListVolumeSettings } from "./Settings/Settings";
import WeekOverview from "./WeekOverview/WeekOverview";

export default function PageContent() {
  return (
    <div className="flex h-full w-full flex-col overflow-y-scroll">
      <TrainingProgramProvider>
        <Section title="Configure Training Program">
          <ProgramConfig />
        </Section>

        <Section title="Customize Training Program">
          <div className="">
            <div className="mb-2 flex flex-col">
              <div className="w-1/4 pr-2">
                <ListVolumeSettings />
              </div>

              <MusclePriorityList />
            </div>

            <WeekOverview>
              <WeekOverview.Split />
              <WeekOverview.Week />
            </WeekOverview>

            <ExerciseOverview>
              <ExerciseOverview.ExercisePreview />
            </ExerciseOverview>
          </div>
        </Section>

        <Section title="Training Block Overview">
          <TrainingBlock />
        </Section>
      </TrainingProgramProvider>
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
