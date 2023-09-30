import { type NextPage } from "next";
import TrainingBlock from "~/components/Macrocycle/TrainingBlock";
import PrioritizeFocus from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelectPrompts,
} from "~/components/PromptCardLayout";
import useEverythingLol, { ExerciseType } from "~/hooks/useEverythingLol";

export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: string;
  sets: number[];
  mesoProgression: number[];
  exercises: ExerciseType[][];
};

type DayType =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";
export type SplitType = "upper" | "lower" | "push" | "pull" | "full" | "off";

export type SessionDayType = {
  day: DayType;
  sessionNum: number;
  sets: [ExerciseType[][], ExerciseType[][]];
  totalSets: [number, number];
  maxSets: [number, number];
  sessions: [SplitType, SplitType];
};

const Home: NextPage = () => {
  const {
    split,
    trainingBlock,
    musclePriority,
    handleUpdateMuscleList,
    handleFrequencyChange,
    hardCodedSessions,
  } = useEverythingLol();

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="fixed flex h-8 w-full items-center justify-center bg-slate-700 ">
        <h1 className="text-lg font-bold text-white">Hyperfit</h1>
      </div>

      <div className="flex h-full w-full pt-8">
        <div className="flex h-full w-1/4 flex-col border-r-2 border-slate-700">
          <PromptCardLayout title="Frequency">
            <FrequencySelectPrompts onClick={handleFrequencyChange} />
          </PromptCardLayout>

          <PrioritySectionLayout>
            <PrioritizeFocus
              musclePriority={musclePriority}
              updateMusclePriority={handleUpdateMuscleList}
            />
          </PrioritySectionLayout>
        </div>

        <div className="flex h-full w-3/4 items-center justify-center">
          <div
            className="flex h-full w-full flex-col overflow-y-scroll rounded border border-slate-700"
            style={{ height: "97%", width: "98%" }}
          >
            <div className="rounded-t-sm bg-slate-700">
              <h2 className="ml-1 p-1 text-white">Training Block</h2>
            </div>

            <TrainingBlock
              hardCodedSessions={hardCodedSessions}
              trainingBlock={trainingBlock}
              split={split}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
