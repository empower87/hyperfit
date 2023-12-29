import {
  BG_COLOR_M5,
  BG_COLOR_M6,
  BORDER_COLOR_M6,
  HOVER_COLOR_M5,
} from "~/constants/themes";
import { getGroupList } from "~/constants/workoutSplits";
import { SplitType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type ItemProps = {
  value: string;
  selectedValue: string;
  onClick: (value: string) => void;
};

const Item = ({ value, selectedValue, onClick }: ItemProps) => {
  const isSelected = value === selectedValue ? true : false;
  const selectedBG = isSelected ? BG_COLOR_M5 : BG_COLOR_M6;
  const selectedText = isSelected ? "text-white" : "text-slate-400";
  const hover = HOVER_COLOR_M5;
  return (
    <li
      className={selectedBG + " mr-1 cursor-pointer " + hover}
      onClick={() => onClick(value)}
    >
      <p className={selectedText + " p-1 text-sm"}>{value}</p>
    </li>
  );
};

type GroupListProps = {
  split: SplitType;
  selectedValue: string;
  onClick: (value: string) => void;
};

export function GroupList({ split, selectedValue, onClick }: GroupListProps) {
  const groups = getGroupList(split);
  return (
    <div className={BORDER_COLOR_M6 + " mb-2 w-full border-b-2 p-1"}>
      <div className=" mb-1">
        <div className={BG_COLOR_M5 + " flex p-1 text-xs text-white"}>
          {split}
        </div>
      </div>
      {/* -- list of groups -- */}
      <ul className={" no-scrollbar flex flex-nowrap overflow-x-scroll"}>
        {groups.map((each) => {
          return (
            <Item
              key={`${each}_group`}
              value={each}
              selectedValue={selectedValue}
              onClick={onClick}
            />
          );
        })}
      </ul>
    </div>
  );
}
