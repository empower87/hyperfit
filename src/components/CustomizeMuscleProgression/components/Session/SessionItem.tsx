import SelectExercise from "~/components/Modals/ChangeExerciseModal/ChangeExerciseModal";
import { AddExerciseItem, ExerciseItem } from "../ExerciseItem";
import Modal from "~/components/Modals/Modal";
import { JSONExercise } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { useCallback, useState } from "react";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import { cn } from "~/lib/clsx";

type SessionItemProps = {
    sessionExercises: ExerciseType[];
    sessionIndex: number;
    exerciseIndices: number[];
  };

export default function SessionItem({
    sessionExercises,
    sessionIndex,
    exerciseIndices,
  }: SessionItemProps) {
    const { microcyclesArray, muscleGroup, onAddExercise, onChangeExercise } =
      useMuscleEditorContext();
    const [selectExerciseParams, setSelectExerciseParams] = useState<
      ["CHANGE" | "ADD", string | number] | null
    >(null);
  
    const onExerciseChangeClick = (exerciseId: ExerciseType["id"]) =>
      setSelectExerciseParams(["CHANGE", exerciseId]);
    const onAddExerciseClick = (sessionIndex: number) =>
      setSelectExerciseParams(["ADD", sessionIndex]);
  
    const onSelectExerciseHandler = useCallback(
      (newExercise: JSONExercise) => {
        if (!selectExerciseParams) return;
        if (selectExerciseParams[0] === "CHANGE") {
          if (typeof selectExerciseParams[1] === "number") return;
          onChangeExercise(selectExerciseParams[1], newExercise);
        } else {
          if (typeof selectExerciseParams[1] === "string") return;
          onAddExercise(newExercise, selectExerciseParams[1]);
        }
      },
      [selectExerciseParams]
    );
  
    const onCloseModal = () => setSelectExerciseParams(null);
    return (
      <li className={`flex flex-col rounded bg-primary-600`}>
        <Modal
          isOpen={selectExerciseParams ? true : false}
          onClose={onCloseModal}
        >
          <SelectExercise
            muscle={muscleGroup}
            exerciseId=""
            onSelect={(newExercise) => onSelectExerciseHandler(newExercise)}
            onClose={onCloseModal}
          />
        </Modal>
  
        <div
          className={`flex justify-between text-xxs text-slate-300 bg-primary-700`}
        >
          <div className={`pl-2`}>Exercise</div>
          <div className={`flex pr-4`}>
            <div className={``}>Week </div>
            {microcyclesArray.map((e, i) => {
              return (
                <div
                  key={`${i}_WeeksSessionHeader`}
                  className={cn(`flex w-3 items-center justify-center text-xxs`, {
                    ["w-11"]: i === 0,
                  })}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
  
        <ul className={`flex flex-col space-y-1 p-1`}>
          {sessionExercises.map((exercise, exerciseIndex) => {
            return (
              <ExerciseItem
                exercise={exercise}
                exerciseIndex={exerciseIndices[exerciseIndex]}
                openSelectModal={() => onExerciseChangeClick(exercise.id)}
              />
            );
          })}
          <AddExerciseItem onClick={() => onAddExerciseClick(sessionIndex)} />
        </ul>
      </li>
    );
  }
