import { type NextPage } from "next";
import { useState } from "react";
import { TestTable } from "~/components/MesoTable";
import PrioritizeFocus from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelect,
} from "~/components/PromptCardLayout";
import Title from "~/components/Title";
import { MesocycleLayout, MesocycleTable } from "~/components/WorkoutCard";

type ListTuple = [string, number];

export type MusclePriorityType = {
  id: string;
  rank: number;
  muscle: string;
  sets: number[];
};

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    rank: 1,
    muscle: "back",
    sets: [10, 20, 25, 30, 35, 35, 35],
  },
  {
    id: "delts_side-008",
    rank: 2,
    muscle: "delts_side",
    sets: [12, 25, 30, 35, 40, 40, 40],
  },
  {
    id: "triceps-014",
    rank: 3,
    muscle: "triceps",
    sets: [8, 16, 20, 25, 35, 35, 35],
  },
  {
    id: "hamstrings-011",
    rank: 4,
    muscle: "hamstrings",
    sets: [6, 12, 16, 18, 18, 18, 18],
  },
  {
    id: "quads-012",
    rank: 5,
    muscle: "quads",
    sets: [8, 8, 8, 8, 8, 8, 8],
  },
  {
    id: "delts_rear-007",
    rank: 6,
    muscle: "delts_rear",
    sets: [6, 6, 6, 6, 6, 6, 6],
  },
  {
    id: "forearms-009",
    rank: 7,
    muscle: "forearms",
    sets: [2, 2, 2, 2, 2, 2, 2],
  },
  {
    id: "traps-013",
    rank: 8,
    muscle: "traps",
    sets: [4, 4, 4, 4, 4, 4, 4],
  },
  {
    id: "biceps-003",
    rank: 9,
    muscle: "biceps",
    sets: [6, 6, 6, 6, 6, 6, 6],
  },

  {
    id: "chest-005",
    rank: 10,
    muscle: "chest",
    sets: [4, 4, 4, 4, 4, 4, 4],
  },
  {
    id: "calves-004",
    rank: 11,
    muscle: "calves",
    sets: [6, 6, 6, 6, 6, 6, 6],
  },

  {
    id: "delts_front-006",
    rank: 12,
    muscle: "delts_front",
    sets: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "abs-001",
    rank: 13,
    muscle: "abs",
    sets: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "glutes-010",
    rank: 14,
    muscle: "glutes",
    sets: [0, 0, 0, 0, 0, 0, 0],
  },
];

export type SessionType = {
  day: number;
  sets: [string, number][];
  totalSets: number;
  maxSets: number;
  split: "full" | "upper" | "lower";
};

const Home: NextPage = () => {
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [workoutSplit, setWorkoutSplit] = useState<SessionType[]>([]);
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ...MUSCLE_PRIORITY_LIST,
  ]);

  const handleSelectChange = (value: number) => {
    setTotalWorkouts(value);
  };

  return (
    <>
      <Title />

      <div className="flex h-full w-full flex-col justify-center">
        <PromptCardLayout title="Frequency">
          <FrequencySelect onChange={handleSelectChange} />
        </PromptCardLayout>

        <PrioritySectionLayout
          table={<TestTable list={musclePriority} split={workoutSplit} />}
        >
          {totalWorkouts > 0 ? (
            <PrioritizeFocus
              totalWorkouts={totalWorkouts}
              musclePriority={musclePriority}
              setMusclePriority={setMusclePriority}
              setWorkoutSplit={setWorkoutSplit}
            />
          ) : null}
        </PrioritySectionLayout>
      </div>

      <div className="mt-2 flex h-full w-full flex-col items-center">
        <div className="mb-3 w-3/4 rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Training Program</h2>
        </div>
        <div className="flex flex-wrap justify-center">
          {/* {workoutSplit.length > 0
            ? workoutSplit.map((each, index) => {
                console.log(each, "during splitList mapping");
                return (
                  <WorkoutCard
                    key={`${each.day}x${index}`}
                    day={each.day}
                    split={each.split}
                    sets={each.sets}
                  />
                );
              })
            : null} */}

          {/* {workoutSplit.length > 0 && (
            
          )} */}

          <MesocycleLayout number={1}>
            <MesocycleTable split={workoutSplit} />
          </MesocycleLayout>
        </div>
      </div>
    </>
  );
};

export default Home;
