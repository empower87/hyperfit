import { ReactNode } from "react";
import { SplitSessionsNameType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M7 } from "~/utils/themes";
import { FrequencySelectPrompts } from "./SelectFrequency";

const SPLITS = {
  OPT: "optimized",
  CUS: "custom",
  PPL: "push / pull / legs",
  UL: "upper / lower",
  BRO: "bro",
  PPLUL: "push / pull / legs - upper / lower",
  FB: "full body",
};

type SelectSplitProps = {
  selectedSplit: SplitSessionsNameType;
  onSelect: (type: SplitSessionsNameType) => void;
};
function SelectSplit({ selectedSplit, onSelect }: SelectSplitProps) {
  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value as SplitSessionsNameType);
  };

  return (
    <select onChange={onSelectHandler}>
      {Object.entries(SPLITS).map((each) => {
        const sessionSplitKey = each[0] as SplitSessionsNameType;
        return (
          <option selected={selectedSplit === sessionSplitKey ? true : false}>
            {each[1]}
          </option>
        );
      })}
    </select>
  );
}

function CustomizeSelectsLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const rightMargin = title === "Frequency" ? "mr-1" : "";
  return (
    <div className={rightMargin + " flex w-1/2 flex-col"}>
      <div className={BG_COLOR_M7 + " mb-1"}>
        <h3 className=" indent-1 text-white">{title}</h3>
      </div>

      <div className="">{children}</div>
    </div>
  );
}

type CustomizeSelectsProps = {
  onFrequencyChange: (first: number, second: number) => void;
  onSplitChange: (type: SplitSessionsNameType) => void;
  currentSplit: SplitSessionsNameType;
};
export function CustomizeSelects({
  onFrequencyChange,
  onSplitChange,
  currentSplit,
}: CustomizeSelectsProps) {
  return (
    <div className=" mb-2 flex">
      <CustomizeSelectsLayout title="Frequency">
        <FrequencySelectPrompts onClick={onFrequencyChange} />
      </CustomizeSelectsLayout>

      <CustomizeSelectsLayout title="Split">
        <SelectSplit selectedSplit={currentSplit} onSelect={onSplitChange} />
      </CustomizeSelectsLayout>
    </div>
  );
}
