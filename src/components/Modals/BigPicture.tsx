import {
  DayType,
  ExerciseType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getSessionSplitColor } from "~/utils/getSessionSplitColor";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/utils/themes";
import { useTrainingBlockContext } from "../Macrocycle/TrainingBlock/context/TrainingBlockContext";

type BigPictureProps = {
  group: string;
  totals: (group: string) => {
    totalSets: number;
    exercises: ExerciseType[];
    frequency: number;
  };
  selectedExercise: string;
};

export default function BigPicture({
  group,
  totals,
  selectedExercise,
}: BigPictureProps) {
  const { totalSets, exercises, frequency } = totals(group);
  const { trainingBlock } = useTrainingBlockContext();

  const getTrainingDay = (session: number, exerciseId: string) => {
    const lastMeso = trainingBlock[2];
    let data: [DayType, SplitType] = ["Sunday", "off"];

    for (let i = 0; i < lastMeso.length; i++) {
      if (lastMeso[i].sessionNum === session) {
        let index = 0;
        if (
          lastMeso[i].sets[1].some((e) => e.some((ee) => ee.id === exerciseId))
        ) {
          index = 1;
        }
        data[0] = lastMeso[i].day;
        data[1] = lastMeso[i].sessions[index];
      }
    }
    return data;
  };

  return (
    <div className="mb-2 flex h-20">
      <div className=" mr-1">
        <div className=" h-1/5 text-xs text-slate-400">
          All {group} Exercises
        </div>
        <div className=" flex h-4/5 flex-col overflow-y-scroll">
          {exercises.map((exercise) => {
            const data = getTrainingDay(exercise.session, exercise.id);
            const { bg } = getSessionSplitColor(data[1]);

            const defaultClass = " text-xxs mb-0.5 mr-1 flex text-white";
            const unselectedClass = BG_COLOR_M6 + defaultClass;
            const selectedClass = BG_COLOR_M5 + defaultClass;

            const isSelected =
              exercise.exercise === selectedExercise ? true : false;
            return (
              <div
                key={`${exercise.id}_editExercise`}
                className={isSelected ? selectedClass : unselectedClass}
              >
                <div className=" w-36 indent-1">{exercise.exercise}</div>
                <div className=" w-12">{data[0]}</div>
                <div className={bg + " w-9 indent-1"}>{data[1]}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className=" flex flex-col">
        <div className=" text-xs text-slate-400">Frequency</div>
        <div className=" text-xxs text-white">{frequency}</div>
      </div>
      <div className=" flex flex-col">
        <div className=" text-xs text-slate-400">
          Total Volume Mesocycle 3 - Week 4
        </div>
        <div className="text-xxs text-white">{totalSets}</div>
      </div>
    </div>
  );
}
