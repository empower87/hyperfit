
import { getGroupList } from "~/constants/workoutSplits";
import { SplitType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

type ItemProps = {
  value: string;
  selectedValue: string;
  onClick: (value: string) => void;
};

const Item = ({ value, selectedValue, onClick }: ItemProps) => {
  const isSelected = value === selectedValue ? true : false;
  const selectedBG = isSelected ? "bg-primary-500" : "bg-primary-600";
  const selectedText = isSelected ? "text-white" : "text-slate-400";

  return (
    <li
      className={selectedBG + " mr-1 cursor-pointer hover:bg-primary-500"}
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
    <div className={"border-primary-600 mb-2 w-full border-b-2 p-1"}>
      <div className="mb-1">
        <div className={"bg-primary-500 flex p-1 text-xs text-white"}>
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
