import ReactDOM from "react-dom";
import {
  ExerciseType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { getGroupList } from "~/utils/getExercises";
import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BG_COLOR_M7,
  BORDER_COLOR_M6,
  HOVER_COLOR_M5,
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

  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div
      className="absolute flex h-full w-full items-center justify-center"
      style={{ background: "#00000087" }}
    >
      <div
        className={BG_COLOR_M7 + " flex flex-col"}
        style={{ width: "550px", height: "300px" }}
      >
        <div
          className={BORDER_COLOR_M6 + " mb-2 flex justify-between border-b-2"}
        >
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
          <GroupList split={split} group={group} exercise={exercise} />

          <div className=" w-4/6">
            <div>{exercise.group}</div>
            <div>{exercise.exercise}</div>
          </div>
        </div>
      </div>
    </div>,
    root
  );
}

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  split: SplitType;
  group: string;
  exercise: ExerciseType;
};

type GroupListProps = Omit<EditExerciseModalProps, "onClose" | "isOpen">;
function GroupList({ split, group, exercise }: GroupListProps) {
  const exercises = getGroupList(group);

  return (
    <div className={BG_COLOR_M7 + " flex h-full w-2/6 flex-col"}>
      <div className={BORDER_COLOR_M6 + " w-full border-b-2 p-1"}>
        {/* -- list of groups -- */}
        <ul className={" no-scrollbar flex flex-nowrap overflow-x-scroll"}>
          {GROUPS.map((each) => {
            return (
              <GroupItem
                key={`${each}_group`}
                value={each}
                selectedValue={group}
              />
            );
          })}
        </ul>
      </div>

      <div className="flex h-5/6 items-center justify-center overflow-hidden">
        {/* -- list of exercises -- */}
        <ul className="overflow-y-scroll" style={{ height: "210px" }}>
          {exercises.map((each) => {
            return (
              <li
                key={`${each.id}`}
                className={BG_COLOR_M7 + " ml-1 text-white"}
              >
                {each.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const GroupItem = ({
  value,
  selectedValue,
}: {
  value: string;
  selectedValue: string;
}) => {
  const isSelected = value === selectedValue ? true : false;
  const selectedBG = isSelected ? BG_COLOR_M5 : BG_COLOR_M6;
  const selectedText = isSelected ? "text-white" : "text-slate-400";
  return (
    <li className={selectedBG + " mr-1"}>
      <p className={selectedText + " p-1 text-sm"}>{value}</p>
    </li>
  );
};
