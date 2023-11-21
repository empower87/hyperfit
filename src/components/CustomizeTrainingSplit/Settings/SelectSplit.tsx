import { ReactNode, useState } from "react";
import { SplitSessionsNameType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M6, BG_COLOR_M7 } from "~/utils/themes";
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
    <select className={BG_COLOR_M7 + " text-white"} onChange={onSelectHandler}>
      {Object.entries(SPLITS).map((each) => {
        const sessionSplitKey = each[0] as SplitSessionsNameType;
        return (
          <option
            key={`${each[1]}_option`}
            className=" text-white"
            value={sessionSplitKey}
            selected={selectedSplit === sessionSplitKey ? true : false}
          >
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
  return (
    <div className={" flex w-1/2 flex-col py-2 pr-2"}>
      <div className={" mb-2 border-b-2 border-slate-500"}>
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
  const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(3);
  const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
    useState<number>(0);
  const [selectedSplitType, setSelectedSplitType] =
    useState<SplitSessionsNameType>("OPT");

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      setTotalDoubleSessionsPerWeek(value);
    } else {
      setTotalSessionsPerWeek(value);
    }
  };

  const onSelectSplit = (type: SplitSessionsNameType) => {
    setSelectedSplitType(type);
  };

  const onButtonClick = () => {
    onFrequencyChange(totalSessionsPerWeek, totalDoubleSessionsPerWeek);
    onSplitChange(selectedSplitType);
  };

  return (
    <div className=" mb-2 flex w-full flex-col">
      <div className=" flex">
        <CustomizeSelectsLayout title="Frequency">
          <FrequencySelectPrompts
            totalSessionsPerWeek={totalSessionsPerWeek}
            onClick={handleSelectChange}
          />
        </CustomizeSelectsLayout>

        <CustomizeSelectsLayout title="Split">
          <SelectSplit selectedSplit={currentSplit} onSelect={onSelectSplit} />
        </CustomizeSelectsLayout>
      </div>

      <div className="flex h-1/3 items-center justify-center">
        <button
          className={
            BG_COLOR_M6 + " p-1 text-xs font-bold text-white hover:bg-slate-500"
          }
          style={{ height: "80%", width: "95%" }}
          onClick={() => onButtonClick()}
        >
          Set
        </button>
      </div>
    </div>
  );
}
