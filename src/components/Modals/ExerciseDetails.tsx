import { useEffect, useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import {
  DayType,
  ExerciseType,
  SplitType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingBlockContext } from "../Macrocycle/TrainingBlock/context/TrainingBlockContext";

type ExerciseDetailsProps = {
  group: string;
  selectedExercise: ExerciseType;
};

type GroupExercisesType = {
  day: DayType;
  split: SplitType;
  exercises: ExerciseType[];
};

const getGroupExercises = (group: string, split: TrainingDayType[]) => {
  let newSplit: GroupExercisesType[] = [];

  // for (let i = 0; i < split.length; i++) {
  //   const session_one = split[i].sessions[0];
  //   const session_two = split[i].sessions[1];
  //   const sets_one = split[i].sets[0];
  //   const sets_two = split[i].sets[1];

  //   if (session_one !== "off") {
  //     for (let j = 0; j < sets_one.length; j++) {
  //       if (sets_one[j][0].group === group) {
  //         newSplit.push({
  //           day: split[i].day,
  //           split: session_one,
  //           exercises: sets_one[j],
  //         });
  //       }
  //     }
  //   }

  //   if (session_two !== "off") {
  //     for (let j = 0; j < sets_two.length; j++) {
  //       if (sets_two[j][0].group === group) {
  //         newSplit.push({
  //           day: split[i].day,
  //           split: session_two,
  //           exercises: sets_two[j],
  //         });
  //       }
  //     }
  //   }
  // }

  return newSplit;
};

export default function ExerciseDetails({
  group,
  selectedExercise,
}: ExerciseDetailsProps) {
  const { trainingBlock } = useTrainingBlockContext();
  const [split, setSplit] = useState<GroupExercisesType[]>([]);

  useEffect(() => {
    const split = getGroupExercises(group, trainingBlock[2]);

    setSplit(split);
  }, [group]);

  return (
    <div className=" flex">
      <div className=" flex w-1/2 flex-col p-1">
        <div className={BG_COLOR_M6 + " mb-2 flex flex-col p-1"}>
          <div className="text-sm leading-3 text-white">
            {selectedExercise.exercise}
          </div>
          {/* <div className="text-xs text-slate-400">{selectedExercise.group}</div> */}
        </div>

        <div className="mb-2 flex h-20">
          <div className=" flex flex-col">
            <div className=" text-xs text-slate-400">Frequency</div>
            {/* <div className=" text-xxs text-white">{frequency}</div> */}
          </div>
          <div className=" flex flex-col">
            <div className=" text-xs text-slate-400">
              Total Volume Mesocycle 3 - Week 4
            </div>
            {/* <div className="text-xxs text-white">{totalSets}</div> */}
          </div>
        </div>
      </div>

      <div className=" flex w-1/2 flex-col p-1">
        {/* <div className=" flex h-1/5 text-xs text-slate-400">
          <div className=" flex w-1/2">
            <div className=" w-1/5">Freq</div>
            <div className=" w-2/5">Day</div>
            <div className=" w-2/5">Split</div>
          </div>

          <div className=" w-1/2">Exercises</div>
        </div> */}

        <div className=" flex flex-col overflow-y-scroll">
          {split.map((each, index) => {
            const frequency = index + 1;
            return (
              <FullItem
                groupExercise={each}
                frequency={frequency}
                selectedExercise={selectedExercise}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

type FullItemProps = {
  groupExercise: GroupExercisesType;
  frequency: number;
  selectedExercise: ExerciseType;
};

function FullItem({
  groupExercise,
  frequency,
  selectedExercise,
}: FullItemProps) {
  const exercises = groupExercise.exercises;
  const lastIndex = exercises.length - 1;

  return (
    <div className=" mb-1 flex">
      <div className={BG_COLOR_M6 + " mr-1 flex w-5/12"}>
        <div className=" w-1/5 indent-1 text-xxs text-slate-400">
          {frequency}
        </div>
        <div className=" w-2/5 text-xxs text-slate-400">
          {groupExercise.day}
        </div>
        <div className=" w-2/5 indent-1 text-xxs text-slate-400">
          {groupExercise.split}
        </div>
      </div>

      <div className="w-7/12">
        {exercises.map((exercise, index) => {
          let mb = " mb-1";
          if (index === lastIndex) {
            mb = "";
          }
          return (
            <ExerciseItem
              exercise={exercise}
              selectedExercise={selectedExercise.exercise}
              mb={mb}
            />
          );
        })}
      </div>
    </div>
  );
}

type ExerciseItemProps = {
  exercise: ExerciseType;
  selectedExercise: string;
  mb: string;
};
function ExerciseItem({ exercise, selectedExercise, mb }: ExerciseItemProps) {
  const defaultClass = " text-xxs mr-1 flex" + mb;
  const unselectedClass = BG_COLOR_M6 + " text-slate-400" + defaultClass;
  const selectedClass = BG_COLOR_M5 + " text-white" + defaultClass;

  const isSelected = exercise.exercise === selectedExercise ? true : false;
  return (
    <div className={isSelected ? selectedClass : unselectedClass}>
      <div className=" ml-1">{exercise.sets}x</div>
      <div className=" indent-1">{exercise.exercise}</div>
    </div>
  );
}
