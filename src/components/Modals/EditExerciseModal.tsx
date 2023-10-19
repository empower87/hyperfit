import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  ExerciseDetails,
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

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  split: SplitType;
  group: string;
  exercise: ExerciseType;
  currentMesocycle: number;
};
export default function EditExerciseModal({
  isOpen,
  onClose,
  split,
  group,
  exercise,
  currentMesocycle,
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
        style={{ width: "720px", height: "300px" }}
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

          <div className=" flex w-3/4 flex-col p-2">
            <div className=" h-full">
              <div className={BG_COLOR_M6 + " mb-2 flex flex-col p-1"}>
                <div className="text-sm leading-3 text-white">
                  {selectedExercise.exercise}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedExercise.group}
                </div>
              </div>

              <MesocycleDetails
                mesocycle={1}
                exercise={selectedExercise}
                selectedMesocycle={currentMesocycle - 1}
              />

              <MesocycleDetails
                mesocycle={2}
                exercise={selectedExercise}
                selectedMesocycle={currentMesocycle - 1}
              />

              <MesocycleDetails
                mesocycle={3}
                exercise={selectedExercise}
                selectedMesocycle={currentMesocycle - 1}
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

type MesocycleDetailsProps = {
  mesocycle: number;
  exercise: ExerciseType;
  selectedMesocycle: number;
};

const MesocycleDetails = ({
  mesocycle,
  exercise,
  selectedMesocycle,
}: MesocycleDetailsProps) => {
  const exerciseDetails = exercise.meso_details[mesocycle - 1];
  const isSelected = mesocycle === selectedMesocycle ? true : false;

  // const defaultClass = " text-white w-1/5";
  const defaultClass = " flex h-14 w-full";
  const selectedClass = BG_COLOR_M5 + defaultClass;
  return (
    <div className={isSelected ? selectedClass : defaultClass}>
      <div className={" w-2/12 text-white"}>
        <div className="indent-1 text-xs">Mesocycle {mesocycle}</div>
      </div>
      {exerciseDetails == null ? (
        <div className="text-xs text-slate-400">
          Exercise initiated in another Mesocycle
        </div>
      ) : (
        <div className="flex w-10/12">
          <WeekDetail week={1} exerciseDetails={exerciseDetails} />
          <WeekDetail week={2} exerciseDetails={exerciseDetails} />
          <WeekDetail week={3} exerciseDetails={exerciseDetails} />
          <WeekDetail week={4} exerciseDetails={exerciseDetails} />
        </div>
      )}
    </div>
  );
};

type WeekProps = {
  week: number;
  exerciseDetails: ExerciseDetails;
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
    <div className=" flex flex-col pr-1">
      <div className="">
        <p className="text-xs text-white">Week {week}</p>
      </div>
      <div className="flex">
        <ExerciseDetail name="Sets" value={sets} />
        <ExerciseDetail name="Reps" value={exerciseDetails.reps} />
        <ExerciseDetail name="Weight" value={weight} />
      </div>
    </div>
  );
};

type ExerciseDetailProps = {
  name: string;
  value: number;
};
const ExerciseDetail = ({ name, value }: ExerciseDetailProps) => {
  return (
    <div className=" flex flex-col">
      <div className={BG_COLOR_M6 + " text-xxs mr-1 p-0.5 text-white"}>
        {name}
      </div>

      <div className={" text-xxs mr-1 flex justify-center p-0.5 text-white"}>
        {value}
      </div>
    </div>
  );
};

type GroupListProps = Omit<
  EditExerciseModalProps,
  "onClose" | "isOpen" | "currentMesocycle"
>;

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
    <div className={BG_COLOR_M7 + " flex h-full w-1/4 flex-col p-2"}>
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
