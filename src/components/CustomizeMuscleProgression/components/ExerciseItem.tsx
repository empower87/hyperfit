import { AddIcon, DeleteIcon } from "~/assets/icons/_icons";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../context/MuscleEditorContext";
import ExerciseSets from "./SetItem";
import { Button } from "./Counter";

type ExerciseItemProps = {
  exercise: ExerciseType;
  exerciseIndex: number;
  openSelectModal: () => void;
};

export function ExerciseItem({
  exercise,
  exerciseIndex,
  openSelectModal,
}: ExerciseItemProps) {
  const { getSetsByExerciseId, onRemoveExercise, toggleSetProgression } =
    useMuscleEditorContext();

  const setsPerWeek = getSetsByExerciseId(exercise.id);

  return (
    <li className={`flex text-xxs text-white bg-primary-500`}>
      <div className={`flex w-3 items-center justify-center`}>
        <button onClick={toggleSetProgression} className={``}>
          {exerciseIndex}
        </button>
      </div>

      <div
        onClick={openSelectModal}
        className={`flex w-32 cursor-pointer items-center truncate indent-0.5 hover:bg-primary-400`}
      >
        {exercise.name}
      </div>

      <div className={`flex`}>
        {setsPerWeek.map((sets, index) => {
          return (
            <ExerciseSets
              key={`${exercise.id}_${index}_${sets}`}
              index={index}
              sets={sets}
              exerciseId={exercise.id}
            />
          );
        })}

        <div
          onClick={() => onRemoveExercise(exercise.id)}
          className={`flex w-3 cursor-pointer items-center justify-center border bg-red-400 border-primary-600 hover:bg-rose-500`}
        >
          <DeleteIcon fill="white" />
        </div>
      </div>
    </li>
  );
}

  
export function AddExerciseItem({ onClick }: { onClick: () => void }) {
  return (
    <li
      onClick={onClick}
      className={`flex cursor-pointer p-0.5 text-xxs bg-primary-600 border-primary-400 border indent-1 text-slate-300 hover:bg-primary-500`}
    >
      <div className={`ml-0.5 flex items-center justify-center`}>
        <Button onClick={onClick}>
          <AddIcon fill="white" />
        </Button>
      </div>
      Add Exercise
    </li>
  );
}
