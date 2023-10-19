import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  ExerciseType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { Exercise, getGroupList } from "~/utils/getExercises";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M6,
  HOVER_COLOR_M5,
  HOVER_COLOR_M6,
} from "~/utils/themes";

const GROUPS = [
  "chest",
  "back",
  "biceps",
  "triceps",
  "delts_side",
  "delts_rear",
  "delts_front",
  "traps",
  "forearms",
  "abs",
  "quads",
  "hamstrings",
  "glutes",
  "calves",
];

export default function EditExerciseModal({
  isOpen,
  onClose,
  split,
  group,
  exercise,
}: EditExerciseModalProps) {
  const root = document.getElementById("edit-modal")!;
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
        style={{ width: "550px", height: "300px" }}
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
          <GroupList
            split={split}
            group={group}
            exercise={selectedExercise}
            onSelect={selectExerciseHandler}
          />

          <div className=" flex w-4/6 flex-col p-2">
            <div className=" h-full">
              <div className={BG_COLOR_M6 + " mb-2 flex flex-col p-1"}>
                <div className="text-sm leading-3 text-white">
                  {selectedExercise.exercise}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedExercise.group}
                </div>
              </div>

              <div className=" flex ">
                <ExerciseDetail name="Sets" value={exercise.sets} />
                <ExerciseDetail name="Reps" value={exercise.reps} />
                <ExerciseDetail name="Weight" value={exercise.weight} />
              </div>
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

type ExerciseDetailProps = {
  name: string;
  value: number;
};

const ExerciseDetail = ({ name, value }: ExerciseDetailProps) => {
  return (
    <div className=" flex flex-col">
      <div className={BG_COLOR_M6 + " mr-1 p-1 text-xs text-white"}>{name}</div>

      <div className={" mr-1 flex justify-center p-1 text-xs text-white"}>
        {value}
      </div>
    </div>
  );
};

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  split: SplitType;
  group: string;
  exercise: ExerciseType;
};

type GroupListProps = Omit<EditExerciseModalProps, "onClose" | "isOpen">;

interface IGroupListProps extends GroupListProps {
  onSelect: (value: string, group: string) => void;
}

function GroupList({ split, group, exercise, onSelect }: IGroupListProps) {
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
    <div className={BG_COLOR_M7 + " flex h-full w-2/6 flex-col p-2"}>
      <div className={BORDER_COLOR_M6 + " w-full border-b-2 p-1"}>
        {/* -- list of groups -- */}
        <ul className={" no-scrollbar flex flex-nowrap overflow-x-scroll"}>
          {GROUPS.map((each) => {
            return (
              <HorizontalItem
                key={`${each}_group`}
                value={each}
                selectedValue={muscleGroup}
                onClick={onGroupClick}
              />
            );
          })}
        </ul>
      </div>

      <div className="flex h-5/6 items-center justify-center overflow-hidden">
        {/* -- list of exercises -- */}
        <ul className="w-full overflow-y-scroll" style={{ height: "210px" }}>
          {exercises.map((each) => {
            return (
              <VerticalItem
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

const HorizontalItem = ({ value, selectedValue, onClick }: ItemProps) => {
  const isSelected = value === selectedValue ? true : false;
  const selectedBG = isSelected ? BG_COLOR_M5 : BG_COLOR_M6;
  const selectedText = isSelected ? "text-white" : "text-slate-400";
  const hover = HOVER_COLOR_M5;
  return (
    <li
      className={selectedBG + " mr-1 w-full cursor-pointer " + hover}
      onClick={() => onClick(value)}
    >
      <p className={selectedText + " p-1 text-sm"}>{value}</p>
    </li>
  );
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
      <p className={selectedText + " p-1 text-xs"}>{value}</p>
    </li>
  );
};
