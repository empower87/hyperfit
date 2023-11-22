import { ReactNode, useState } from "react";
import { SplitSessionsNameType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M6, BG_COLOR_M8 } from "~/utils/themes";

const OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7];
const SPLITS = {
  OPT: "optimized",
  CUS: "custom",
  PPL: "push / pull / legs",
  UL: "upper / lower",
  BRO: "bro",
  PPLUL: "push / pull / legs - upper / lower",
  FB: "full body",
};

type SelectProps<T> = {
  selectedOption: T;
  options: T[];
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function Select<T extends string | number>({
  selectedOption,
  options,
  onSelect,
}: SelectProps<T>) {
  return (
    <select
      className={BG_COLOR_M8 + " h-full w-full text-white"}
      onChange={onSelect}
    >
      {options.map((each, index) => {
        return (
          <option
            key={`${each}_${index}_select`}
            value={each}
            selected={selectedOption === each ? true : false}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

function SelectFrequency({
  title,
  selectedOption,
  options,
  onChange,
}: {
  title: string;
  selectedOption: number;
  options: number[];
  onChange: (value: number, type: "week" | "day") => void;
}) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value);
    const type = title === "Weekly Sessions: " ? "week" : "day";
    onChange(value, type);
  };

  return (
    <div className="flex h-6">
      <p className="w-4/5 p-1 text-xs leading-3 text-slate-300">{title}</p>
      <div className=" flex w-1/5">
        <Select
          selectedOption={selectedOption}
          options={options}
          onSelect={handleSelectChange}
        />
      </div>
    </div>
  );
}

type SelectSplitProps = {
  selectedOption: SplitSessionsNameType;
  onSelect: (type: SplitSessionsNameType) => void;
};

function SelectSplit({ selectedOption, onSelect }: SelectSplitProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const result: SplitSessionsNameType | undefined = (
      Object.keys(SPLITS) as (keyof typeof SPLITS)[]
    ).find((key) => SPLITS[key] === value);
    if (!result) return;
    onSelect(result);
  };

  const options = Object.values(SPLITS);
  const selected = SPLITS[selectedOption];
  return (
    <div className=" flex w-full">
      <Select
        selectedOption={selected}
        options={options}
        onSelect={handleSelectChange}
      />
    </div>
  );
}

function SelectLayout({
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

type SelectFrequencySplitProps = {
  onFrequencyChange: (first: number, second: number) => void;
  onSplitChange: (type: SplitSessionsNameType) => void;
  currentSplit: SplitSessionsNameType;
};

export default function SelectFrequencySplit({
  onFrequencyChange,
  onSplitChange,
  currentSplit,
}: SelectFrequencySplitProps) {
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
        <SelectLayout title="Frequency">
          <SelectFrequency
            title="Weekly Sessions: "
            options={[...OPTIONS].slice(3)}
            selectedOption={totalSessionsPerWeek}
            onChange={handleSelectChange}
          />

          <SelectFrequency
            title="Daily Sessions: "
            options={[...OPTIONS].slice(0, totalSessionsPerWeek + 1)}
            selectedOption={totalDoubleSessionsPerWeek}
            onChange={handleSelectChange}
          />
        </SelectLayout>

        <SelectLayout title="Split">
          <SelectSplit selectedOption={currentSplit} onSelect={onSelectSplit} />
        </SelectLayout>
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
