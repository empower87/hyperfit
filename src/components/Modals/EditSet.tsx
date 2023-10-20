import {
  ExerciseDetails,
  ExerciseType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/utils/themes";

type ExerciseDetailProps = {
  name: string;
  value: number;
};
type WeekProps = {
  week: number;
  exerciseDetails: ExerciseDetails;
};
type MesocycleDetailsProps = {
  mesocycle: number;
  exercise: ExerciseType;
  selectedMesocycle: number;
};
type EditSetsProps = {
  selectedExercise: ExerciseType;
  currentMesocycle: number;
};

const ExerciseDetail = ({ name, value }: ExerciseDetailProps) => {
  return (
    <div className=" flex flex-col">
      <div className={BG_COLOR_M6 + " text-xxs text-white"}>{name}</div>

      <div className={" text-xxs flex justify-center text-white"}>{value}</div>
    </div>
  );
};

const ExerciseDetailWeekOne = ({ name, value }: ExerciseDetailProps) => {
  return (
    <div className=" flex flex-col">
      <div className={BG_COLOR_M6 + " text-xxs mr-1 text-white"}>{name}</div>

      <div className={" text-xxs mr-1 flex justify-center text-white"}>
        <div className={BG_COLOR_M6 + " flex h-5 w-5 justify-center"}>-</div>
        <div className={" flex h-5 w-6 justify-center"}>{value}</div>
        <div className={BG_COLOR_M6 + " flex h-5 w-5 justify-center"}>+</div>
      </div>
    </div>
  );
};

const WeekOneDetail = ({ week, exerciseDetails }: WeekProps) => {
  const exerciseIncrements = {
    sets: 1,
    weight: 5,
  };

  const sets =
    week === 1
      ? exerciseDetails.sets
      : exerciseDetails.sets + exerciseIncrements.sets;
  const weight =
    week === 1
      ? exerciseDetails.weight
      : exerciseDetails.weight + exerciseIncrements.weight;
  return (
    <div className=" flex flex-col pr-1" style={{ width: "46%" }}>
      <div className=" h-1/3">
        <p className="text-xs text-white">Week 1</p>
      </div>
      <div className="flex h-2/3">
        <ExerciseDetailWeekOne name="Sets" value={sets} />
        <ExerciseDetailWeekOne name="Reps" value={exerciseDetails.reps} />
        <ExerciseDetailWeekOne name="Weight" value={weight} />
      </div>
    </div>
  );
};

const WeekDetail = ({ week, exerciseDetails }: WeekProps) => {
  const exerciseIncrements = {
    sets: 1,
    weight: 5,
  };

  const sets =
    week === 1
      ? exerciseDetails.sets
      : exerciseDetails.sets + exerciseIncrements.sets;
  const weight =
    week === 1
      ? exerciseDetails.weight
      : exerciseDetails.weight + exerciseIncrements.weight;
  return (
    <div className=" flex flex-col" style={{ width: "18%" }}>
      <div className=" h-1/3">
        <p className="text-xs text-white">Week {week}</p>
      </div>
      <div className="flex h-2/3">
        <ExerciseDetail name="Sets" value={sets} />
        <ExerciseDetail name="Reps" value={exerciseDetails.reps} />
        <ExerciseDetail name="Weight" value={weight} />
      </div>
    </div>
  );
};

const MesocycleDetails = ({
  mesocycle,
  exercise,
  selectedMesocycle,
}: MesocycleDetailsProps) => {
  const exerciseDetails = exercise.meso_details[mesocycle - 1];
  const isSelected = mesocycle === selectedMesocycle ? true : false;

  // const defaultClass = " text-white w-1/5";
  const defaultClasses = " flex h-14 w-full mb-1";
  const unselectedClasses = BG_COLOR_M6 + defaultClasses;
  const selectedClasses = BG_COLOR_M5 + defaultClasses;
  return (
    <div className={isSelected ? selectedClasses : unselectedClasses}>
      <div className={" w-2/12 text-white"}>
        <div className="indent-1 text-xs">Mesocycle {mesocycle}</div>
      </div>
      {exerciseDetails == null ? (
        <div className="text-xs text-slate-400">
          Exercise initiated in another Mesocycle
        </div>
      ) : (
        <div className="flex w-10/12">
          <WeekOneDetail week={1} exerciseDetails={exerciseDetails} />
          <WeekDetail week={2} exerciseDetails={exerciseDetails} />
          <WeekDetail week={3} exerciseDetails={exerciseDetails} />
          <WeekDetail week={4} exerciseDetails={exerciseDetails} />
        </div>
      )}
    </div>
  );
};

export default function EditSets({
  selectedExercise,
  currentMesocycle,
}: EditSetsProps) {
  return (
    <div>
      <MesocycleDetails
        mesocycle={1}
        exercise={selectedExercise}
        selectedMesocycle={currentMesocycle + 1}
      />

      <MesocycleDetails
        mesocycle={2}
        exercise={selectedExercise}
        selectedMesocycle={currentMesocycle + 1}
      />

      <MesocycleDetails
        mesocycle={3}
        exercise={selectedExercise}
        selectedMesocycle={currentMesocycle + 1}
      />
    </div>
  );
}
