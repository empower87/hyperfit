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

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  const handleUpperLowerSplit = (list: Workout[]) => {
    if (!list.length) return [0, 0];
    let even = Math.floor(list.length / 2);

    if (list.length % 2 > 0) {
      if (list[0]?.session === "upper") {
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

      if (startIndex % 2 > 0) {
        return {
          day: startIndex,
          session: split === "ODD" ? "upper" : "lower",
          sets: [],
        };
      } else {
        return {
          day: startIndex,
          session: split === "EVEN" ? "upper" : "lower",
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
  }, [selectedOption]);

  return (
    <>
      <div className="m-2 flex h-full w-full flex-col justify-center">
        <Title />
        <PromptCard options={NUMBERS} onChange={handleSelectChange} />
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

const PriorityPicker = () => {
  return (
    <div className="flex rounded border-2 border-gray-600">
      <h1 className="">
        Priority: Please select your priority for this cycle.
      </h1>
      {/* 
      <select onChange={handleSelectChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select> */}
    </div>
  );
};
