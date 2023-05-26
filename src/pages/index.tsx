import { type NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import PrioritizeFocus, {
  handleUpperLowerSplit,
} from "~/components/PrioritizeFocus";
import PromptCard from "~/components/Prompt";
import Title from "~/components/Title";
import WorkoutCard from "~/components/WorkoutCard";

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
    sets: 10,
  },
  {
    id: "biceps-003",
    muscle: "biceps",
    sets: 6,
  },
  {
    id: "chest-005",
    muscle: "chest",
    sets: 6,
  },
  {
    id: "delts_rear-007",
    muscle: "delts_rear",
    sets: 8,
  },
  {
    id: "delts_side-008",
    muscle: "delts_side",
    sets: 8,
  },
  {
    id: "glutes-010",
    muscle: "glutes",
    sets: 0,
  },
  {
    id: "hamstrings-011",
    muscle: "hamstrings",
    sets: 4,
  },
  {
    id: "quads-013",
    muscle: "quads",
    sets: 8,
  },
  {
    id: "traps-014",
    muscle: "traps",
    sets: 4,
  },
  {
    id: "triceps-015",
    muscle: "triceps",
    sets: 6,
  },
];

export type SplitType = { day: number; split: string; sets: ListTuple[] };

const Home: NextPage = () => {
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [workoutSplit, setWorkoutSplit] = useState<SplitType[]>([]);
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ...MUSCLE_PRIORITY_LIST,
  ]);
  const [split, setSplit] = useState<number[]>([1, 0]);
  const handleSelectChange = (value: number) => {
    setTotalWorkouts(value);
  };
  useEffect(() => {
    const split = handleUpperLowerSplit(musclePriority, totalWorkouts);
    setSplit(split);
  }, [totalWorkouts, musclePriority]);

  // const split = handleUpperLowerSplit(musclePriority, totalWorkouts);
  const renderRef = useRef<number>(0);
  console.log(renderRef.current++, "<Index /> render count");
  return (
    <>
      <Title />
      <div className="flex h-full w-full flex-col justify-center p-2">
        <PromptCard onChange={handleSelectChange} />
        {totalWorkouts > 0 ? (
          <PrioritizeFocus
            split={split}
            totalWorkouts={totalWorkouts}
            musclePriority={musclePriority}
            setMusclePriority={setMusclePriority}
            setWorkoutSplit={setWorkoutSplit}
            workoutSplit={workoutSplit}
          />
        ) : null}
      </div>

      <div className="flex h-full w-full flex-wrap justify-center">
        {workoutSplit.length > 0
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
          : null}
      </div>
    </>
  );
};

export default Home;
