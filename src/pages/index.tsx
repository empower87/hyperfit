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

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: 1,
    muscle: "back",
    sets: [10, 20, 25, 30, 35, 35, 35],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_side-008",
    rank: 2,
    muscle: "delts_side",
    sets: [12, 25, 30, 35, 40, 40, 40],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "triceps-014",
    rank: 3,
    muscle: "triceps",
    sets: [8, 16, 20, 25, 35, 35, 35],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "hamstrings-011",
    rank: 4,
    muscle: "hamstrings",
    sets: [6, 12, 16, 18, 18, 18, 18],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "quads-012",
    rank: 5,
    muscle: "quads",
    sets: [8, 8, 8, 8, 8, 8, 8],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "delts_rear-007",
    rank: 6,
    muscle: "delts_rear",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "forearms-009",
    rank: 7,
    muscle: "forearms",
    sets: [2, 2, 2, 2, 2, 2, 2],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "traps-013",
    rank: 8,
    muscle: "traps",
    sets: [4, 4, 4, 4, 4, 4, 4],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "biceps-003",
    rank: 9,
    muscle: "biceps",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "chest-005",
    rank: 10,
    muscle: "chest",
    sets: [4, 4, 4, 4, 4, 4, 4],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "calves-004",
    rank: 11,
    muscle: "calves",
    sets: [6, 6, 6, 6, 6, 6, 6],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },

  {
    id: "delts_front-006",
    rank: 12,
    muscle: "delts_front",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "abs-001",
    rank: 13,
    muscle: "abs",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
  {
    id: "glutes-010",
    rank: 14,
    muscle: "glutes",
    sets: [0, 0, 0, 0, 0, 0, 0],
    mesoProgression: [0, 0, 0],
    exercises: [],
  },
];

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

// export type SessionDayType = {
//   day: DayType;
//   sessionNum: number;
//   sessions: [SplitType, SplitType];
// };

export type SessionType = {
  day: number;
  sets: ExerciseType[][];
  totalSets: number;
  maxSets: number;
  split: "full" | "upper" | "lower";
};

const Home: NextPage = () => {
  const {
    split,
    trainingBlock,
    totalSessions,
    handleFrequencyChange,
    musclePriority,
    handleUpdateMuscleList,
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
