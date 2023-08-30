import { type NextPage } from "next";
import { useEffect, useState } from "react";
import TrainingBlock from "~/components/Macrocycle/TrainingBlock";
import PrioritizeFocus from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelect,
} from "~/components/PromptCardLayout";
import Title from "~/components/Title";
import { ExerciseType } from "~/hooks/useTrainingBlock";

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

export type SessionType = {
  day: number;
  sets: ExerciseType[][];
  totalSets: number;
  maxSets: number;
  split: "full" | "upper" | "lower";
};

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];

const Home: NextPage = () => {
  const [sessions, setSessions] = useState<[number, number]>([3, 0]);

  const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(3);
  const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
    useState<number>(0);

  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [showTrainingBlock, setShowTrainingBlock] = useState<boolean>(false);
  const [workoutSplit, setWorkoutSplit] = useState<SessionType[]>([]);
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ...MUSCLE_PRIORITY_LIST,
  ]);

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      setTotalDoubleSessionsPerWeek(value);
    } else {
      setTotalSessionsPerWeek(value);
      setShowPrompt(true);
    }
  };

  useEffect(() => {
    setSessions([totalSessionsPerWeek, totalDoubleSessionsPerWeek]);
  }, [totalSessionsPerWeek, totalDoubleSessionsPerWeek]);

  const handleTrainingBlock = () => {
    setShowTrainingBlock(true);
  };

  return (
    <>
      <Title />

      <div className="flex h-full w-full flex-row justify-center">
        <div className="flex w-1/4 flex-col border-r-2 border-slate-700">
          <PromptCardLayout title="Frequency">
            <FrequencySelect
              title="Weekly Sessions: How many days per week you can train?"
              options={[...OPTIONS].slice(3)}
              onChange={handleSelectChange}
            />

            {showPrompt && (
              <FrequencySelect
                title="Daily Sessions: How many daily sessions will you be training double?"
                options={[...OPTIONS].slice(0, totalSessionsPerWeek + 1)}
                onChange={handleSelectChange}
              />
            )}
            {showPrompt && (
              <button onClick={() => handleTrainingBlock()}>
                Get Training Block
              </button>
            )}
          </PromptCardLayout>

          <PrioritySectionLayout>
            {totalSessionsPerWeek > 0 ? (
              <PrioritizeFocus
                totalWorkouts={totalSessionsPerWeek}
                musclePriority={musclePriority}
                setMusclePriority={setMusclePriority}
                setWorkoutSplit={setWorkoutSplit}
              />
            ) : null}
          </PrioritySectionLayout>
        </div>

        <div className="mt-2 flex h-full w-3/4 flex-col items-center">
          <div className="mb-3 w-4/5 rounded-t-sm bg-slate-700">
            <h2 className="ml-1 p-1 text-white">Training Block</h2>
          </div>

          {showTrainingBlock && (
            <TrainingBlock
              workoutSplit={workoutSplit}
              priorityRanking={musclePriority}
              totalSessions={sessions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
