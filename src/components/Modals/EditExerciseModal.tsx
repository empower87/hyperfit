import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M6,
  HOVER_COLOR_M5,
  HOVER_COLOR_M6,
} from "~/constants/themes";
import {
  ExerciseType,
  SplitType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { Exercise, getGroupList } from "~/utils/getExercises";
import EditSets from "./EditSet";
import ExerciseDetails from "./ExerciseDetails";
import { GroupList } from "./SelectLists";

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  split: SplitType;
  exercise: ExerciseType;
  currentMesocycle: number;
};

export default function EditExerciseModal({
  isOpen,
  onClose,
  split,
  exercise,
  currentMesocycle,
}: EditExerciseModalProps) {
  const root = document.getElementById("modal-body")!;

  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseType>(exercise);

  const selectExerciseHandler = (name: string, group: string) => {
    setSelectedExercise((prevExercise) => ({
      ...prevExercise,
      exercise: name,
      group: group,
    }));
  };

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#000000ad" }}
    >
      <div
        className={BG_COLOR_M7 + " flex flex-col"}
        style={{ width: "750px" }}
      >
        <div className={BORDER_COLOR_M6 + " flex justify-between border-b-2"}>
          <div className="flex h-6 justify-center">
            <h3 className="indent-2 text-white">Edit Exercise</h3>
          </div>
          <div className={HOVER_COLOR_M5 + " flex h-6 w-6 justify-center"}>
            <button className={" text-xs text-white"} onClick={() => onClose()}>
              X
            </button>
          </div>
        </div>

        <div className="flex h-full">
          <SideMenu
            split={split}
            group={selectedExercise.muscle}
            exercise={selectedExercise}
            onSelect={selectExerciseHandler}
          />

          <div className=" flex w-3/4 flex-col p-2">
            <div className=" h-full">
              <ExerciseDetails
                group={selectedExercise.muscle}
                selectedExercise={selectedExercise}
              />
              <EditSets
                selectedExercise={selectedExercise}
                currentMesocycle={currentMesocycle}
              />
            </div>

            <div className=" flex h-6 justify-end">
              <button
                className={
                  BG_COLOR_M5 +
                  " ml-1 p-1 text-xs text-slate-300 " +
                  HOVER_COLOR_M6
                }
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <button
                className={
                  BG_COLOR_M8 +
                  " ml-1 w-16 p-1 text-xs font-bold text-white " +
                  HOVER_COLOR_M6
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    root
  );
}

type GroupListProps = Omit<
  EditExerciseModalProps,
  "onClose" | "isOpen" | "currentMesocycle"
>;

interface IGroupListProps extends GroupListProps {
  onSelect: (value: string, group: string) => void;
  group: string;
}

function SideMenu({ split, group, exercise, onSelect }: IGroupListProps) {
  const [muscleGroup, setMuscleGroup] = useState<string>(group);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const groupExercises = getGroupList(muscleGroup);
    setExercises(groupExercises);
  }, [muscleGroup]);

  const onGroupClick = (value: string) => {
    setMuscleGroup(value);
  };

  const onExerciseClick = (value: string) => {
    onSelect(value, muscleGroup);
  };

  return (
    <div className={BG_COLOR_M7 + " flex h-full w-1/4 flex-col p-2"}>
      <GroupList
        split={split}
        selectedValue={muscleGroup}
        onClick={onGroupClick}
      />

      <div className="flex h-5/6 items-center justify-center overflow-hidden">
        {/* -- list of exercises -- */}
        <ul className="w-full overflow-y-scroll" style={{ height: "210px" }}>
          {exercises.map((each) => {
            return (
              <VerticalItem
                key={`${each.name}_exercise`}
                value={each.name}
                selectedValue={exercise.exercise}
                onClick={onExerciseClick}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}

type ItemProps = {
  value: string;
  selectedValue: string;
  onClick: (value: string) => void;
};

const VerticalItem = ({ value, selectedValue, onClick }: ItemProps) => {
  const isSelected = value === selectedValue ? true : false;
  const selectedBG = isSelected ? BG_COLOR_M5 : BG_COLOR_M6;
  const selectedText = isSelected ? "text-white" : "text-slate-400";
  const hover = HOVER_COLOR_M5;
  return (
    <li
      className={selectedBG + " m-1 cursor-pointer " + hover}
      onClick={() => onClick(value)}
    >
      <p className={selectedText + " p-1 text-sm"}>{value}</p>
    </li>
  );
};
