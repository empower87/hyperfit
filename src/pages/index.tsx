import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { TestTable } from "~/components/MesoTable";
import PrioritizeFocus, {
  handleUpperLowerSplit,
} from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelect,
} from "~/components/PromptCardLayout";
import Title from "~/components/Title";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7];

type ListTuple = [string, number];

export type MusclePriorityType = {
  id: string;
  muscle: string;
  sets: number;
};

export const MUSCLE_PRIORITY_LIST: MusclePriorityType[] = [
  {
    id: "back-002",
    muscle: "back",
    sets: 30,
  },
  {
    id: "delts_side-008",
    muscle: "delts_side",
    sets: 35,
  },
  {
    id: "triceps-014",
    muscle: "triceps",
    sets: 25,
  },

  {
    id: "delts_rear-007",
    muscle: "delts_rear",
    sets: 30,
  },
  {
    id: "forearms-009",
    muscle: "forearms",
    sets: 0,
  },
  {
    id: "traps-013",
    muscle: "traps",
    sets: 30,
  },
  {
    id: "biceps-003",
    muscle: "biceps",
    sets: 30,
  },

  {
    id: "chest-005",
    muscle: "chest",
    sets: 30,
  },
  {
    id: "calves-004",
    muscle: "calves",
    sets: 20,
  },

  {
    id: "delts_front-006",
    muscle: "delts_front",
    sets: 0,
  },
  {
    id: "abs-001",
    muscle: "abs",
    sets: 0,
  },
  {
    id: "hamstrings-011",
    muscle: "hamstrings",
    sets: 16,
  },
  {
    id: "quads-012",
    muscle: "quads",
    sets: 22,
  },
  {
    id: "glutes-010",
    muscle: "glutes",
    sets: 0,
  },
];

//testing
export type SessionType = {
  day: number;
  sets: [string, number][];
  totalSets: number;
  maxSets: number;
  split: "full" | "upper" | "lower";
  testSets: [string, number[], number][];
};

export type SplitType = { day: number; split: string; sets: ListTuple[] };

const Home: NextPage = () => {
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [workoutSplit, setWorkoutSplit] = useState<SplitType[]>([]);
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ...MUSCLE_PRIORITY_LIST,
  ]);
  const [split, setSplit] = useState<number[]>([1, 0]);

  //testing
  const [splitTest, setSplitTest] = useState<SessionType[]>([]);

  const handleSelectChange = (value: number) => {
    setTotalWorkouts(value);
  };

  useEffect(() => {
    const split = handleUpperLowerSplit(musclePriority, totalWorkouts);
    setSplit(split);
  }, [totalWorkouts, musclePriority]);

  return (
    <>
      <Title />

      <div className="flex h-full w-full flex-col justify-center">
        <PromptCardLayout title="Frequency">
          <FrequencySelect onChange={handleSelectChange} />
        </PromptCardLayout>

        <PrioritySectionLayout
          table={<TestTable list={musclePriority} split={splitTest} />}
        >
          {totalWorkouts > 0 ? (
            <PrioritizeFocus
              split={split}
              totalWorkouts={totalWorkouts}
              musclePriority={musclePriority}
              setMusclePriority={setMusclePriority}
              setWorkoutSplit={setWorkoutSplit}
              workoutSplit={workoutSplit}
              setSplitTest={setSplitTest}
            />
          ) : null}
        </PrioritySectionLayout>
      </div>

      <div className="mt-2 flex h-full w-full flex-col items-center">
        <div className="mb-3 w-3/4 rounded-t-sm bg-slate-700">
          <h2 className="ml-1 p-1 text-white">Training Week</h2>
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
        </div>
      </div>
    </>
  );
};

export default Home;
