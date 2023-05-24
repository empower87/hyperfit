import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { UPPER_MUSCLES } from "src/constants/workoutSplits";
import PrioritizeFocus, { PickPriority } from "~/components/PrioritizeFocus";
import PromptCard from "~/components/Prompt";
import Title from "~/components/Title";
import WorkoutCard from "~/components/WorkoutCard";

const NUMBERS = [1, 2, 3, 4, 5, 6, 7];

type ListTuple = [string, number];

export type SortObj = {
  id: string;
  muscle: string;
  sets: number;
};

export const SORTED_PRIORITY_LIST_2: SortObj[] = [
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

const SORTED_PRIORITY_LIST: ListTuple[] = [
  ["back", 10],
  ["triceps", 6],
  ["delts_side", 8],
  ["delts_rear", 8],
  ["traps", 4],
  ["chest", 6],
  ["biceps", 6],
  ["quads", 8],
  ["hamstrings", 4],
  ["glutes", 2],
];

type Workout = { day: number; session: string; sets: ListTuple[] };

const Home: NextPage = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const [splitList, setSplitList] = useState<Workout[]>([]);

  const [priorityList, setPriorityList] = useState<ListTuple[]>([
    ...SORTED_PRIORITY_LIST,
  ]);

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

    const createList: Workout[] = SELECTED_NUMBERS.map((each, index) => {
      const startIndex = index + 1;

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
    let copyPriorityList = [...priorityList];

    if (!copyPriorityList.length) return;

    let upperIsOdd = copyList[0]?.session === "upper" ? true : false;

    for (let i = 0; i < copyPriorityList.length; i++) {
      let muscleAndSets = copyPriorityList[i];
      if (!muscleAndSets) return;
      let totalSets = muscleAndSets[1];

      const blah = handleUpperLowerSplit(copyList);

      if (UPPER_MUSCLES.includes(muscleAndSets[0])) {
        let upperSplit = divideSetsAmongDays(blah[0] as number, totalSets);

        console.log(upperSplit, "error is occuring here...a ugaldk");

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
  }, [selectedOption, priority, priorityList]);

  const priorityHandler = (type: "upper" | "lower") => {
    setPriority(type);
  };

  return (
    <>
      <Title />
      <div className="flex h-full w-full flex-col justify-center p-2">
        <PromptCard options={NUMBERS} onChange={handleSelectChange} />
        <PickPriority sessions={selectedOption} onClick={priorityHandler} />
        <PrioritizeFocus
          splitList={splitList}
          list={priorityList}
          setList={setPriorityList}
          setPriority={priorityHandler}
        />
        <p>Selected option: {selectedOption}</p>
      </div>

      <div className="flex h-full w-full flex-wrap justify-center">
        {splitList.map((each, index) => {
          console.log(each, "during splitList mapping");
          return (
            <WorkoutCard
              key={`${each.day}x${index}`}
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
