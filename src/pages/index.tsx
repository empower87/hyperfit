import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { UPPER_MUSCLES } from "src/constants/workoutSplits";
import PromptCard from "~/components/Prompt";
import Title from "~/components/Title";
import WorkoutCard from "~/components/WorkoutCard";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7];

type ListTuple = [string, number];

const SORTED_PRIORITY_LIST: ListTuple[] = [
  ["back", 35],
  ["triceps", 30],
  ["delts (side)", 25],
  ["delts (rear)", 25],
  ["traps", 12],
  ["chest", 8],
  ["biceps", 8],
  ["quads", 30],
  ["hamstrings", 18],
  ["glutes", 12],
];

const WORKOUT_PRIORITY_LIST = [
  {
    rank: 1,
    muscle: "back",
    splitSets: ["horizontal", "vertical"],
    totalSets: 35,
    totalSessions: 3,
    restDays: 1,
    sessionTypes: ["upper", "pull", "full", "back"],
    includedExercises: [],
  },
];

const getWorkoutOrder = (list: ListTuple[]) => {
  if (!list.length) return "ODD";
  const firstIndex = list[0] as ListTuple;
  if (UPPER_MUSCLES.includes(firstIndex[0])) {
    return "ODD";
  } else {
    return "EVEN";
  }
};

type Workout = { day: number; session: string; sets: ListTuple[] };

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const [splitList, setSplitList] = useState<Workout[]>([]);

  const [priority, setPriority] = useState<"upper" | "lower">("upper");

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleUpperLowerSplit = (list: Workout[]) => {
    if (!list.length) return [0, 0];
    let even = Math.floor(list.length / 2);

    if (list.length % 2 > 0) {
      if (priority === "upper") {
        return [even + 1, even];
      } else {
        return [even, even + 1];
      }
    } else {
      return [even, even];
    }
  };

  const divideSetsAmongDays = (days: number, sets: number): number[] => {
    const setsPerDay = Math.floor(sets / days); // Number of sets per day (integer division)
    let remainingSets = sets % days; // Remaining sets after distributing equally
    const result: number[] = [];

    for (let i = 0; i < days; i++) {
      if (remainingSets > 0) {
        result.push(Math.min(setsPerDay + 1, 12)); // Add one set to the day if there are remaining sets
        remainingSets--;
      } else {
        result.push(Math.min(setsPerDay, 12)); // Distribute the sets equally among the days
      }
    }

    return result;
  };

  useEffect(() => {
    if (!selectedOption) return;
    const SELECTED_NUMBERS = NUMBERS.filter(
      (each) => each <= parseInt(selectedOption)
    );
    const splitStart = getWorkoutOrder(SORTED_PRIORITY_LIST);

    const createList: Workout[] = SELECTED_NUMBERS.map((each, index) => {
      const startIndex = index + 1;
      const split = splitStart;

      let upperIsEven = priority === "upper" ? true : false;

      if (upperIsEven) {
        return {
          day: startIndex,
          session: index % 2 === 0 ? "upper" : "lower",
          sets: [],
        };
      } else {
        return {
          day: startIndex,
          session: index % 2 === 0 ? "lower" : "upper",
          sets: [],
        };
      }
    });

    if (!createList.length) return;

    let copyList = [...createList];
    let copyPriorityList = [...SORTED_PRIORITY_LIST];

    if (!copyPriorityList.length) return;

    let upperIsOdd = copyList[0]?.session === "upper" ? true : false;

    for (let i = 0; i < copyPriorityList.length; i++) {
      let muscleAndSets = copyPriorityList[i];
      if (!muscleAndSets) return;
      let totalSets = muscleAndSets[1];

      const blah = handleUpperLowerSplit(copyList);

      if (UPPER_MUSCLES.includes(muscleAndSets[0])) {
        let upperSplit = divideSetsAmongDays(blah[0] as number, totalSets);

        let counter = 0;

        if (upperIsOdd) {
          counter = 0;
        } else {
          counter = 1;
        }

        for (let i = 0; i <= upperSplit.length; i++) {
          copyList[counter]?.sets.push([
            muscleAndSets[0],
            upperSplit[i] as number,
          ]);
          counter = counter + 2;
        }
      } else {
        let lowerSplit = divideSetsAmongDays(blah[1] as number, totalSets);
        let counter = 0;

        if (upperIsOdd) {
          counter = 1;
        } else {
          counter = 0;
        }

        for (let i = 0; i <= lowerSplit.length; i++) {
          copyList[counter]?.sets.push([
            muscleAndSets[0],
            lowerSplit[i] as number,
          ]);
          counter = counter + 2;
        }
      }
    }

    setSplitList(copyList);
  }, [selectedOption, priority]);

  const priorityHandler = (type: "upper" | "lower") => {
    setPriority(type);
  };

  return (
    <>
      <div className="m-2 flex h-full w-full flex-col justify-center">
        <Title />
        <PromptCard options={NUMBERS} onChange={handleSelectChange} />
        <PickPriority sessions={selectedOption} onClick={priorityHandler} />
        <p>Selected option: {selectedOption}</p>
      </div>

      <div className="flex h-full w-full flex-wrap justify-center">
        {splitList.map((each) => {
          return (
            <WorkoutCard
              day={each.day}
              session={each.session}
              sets={each.sets}
            />
          );
        })}
      </div>
    </>
  );
};

export default Home;

const PickPriority = ({
  sessions,
  onClick,
}: {
  sessions: string;
  onClick: (type: "upper" | "lower") => void;
}) => {
  const [isOdd, setIsOdd] = useState<boolean>(false);

  const onClickHandler = (type: "upper" | "lower") => {
    onClick(type);
    setIsOdd(false);
  };

  useEffect(() => {
    const isOdd = parseInt(sessions) % 2 > 0 ? true : false;
    setIsOdd(isOdd);
  }, [sessions]);

  if (isOdd) {
    return (
      <div>
        <p>Would you like to prioritize your upper body or lower body?</p>
        <div>
          <button onClick={() => onClickHandler("upper")}>Upper</button>
          <button onClick={() => onClickHandler("lower")}>Lower</button>
        </div>
      </div>
    );
  } else return null;
};
