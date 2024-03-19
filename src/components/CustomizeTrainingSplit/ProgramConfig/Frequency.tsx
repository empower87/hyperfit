import { useCallback, useState } from "react";
import { Select, SelectLabel } from "~/components/Layout/Select";
import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { useProgramConfigContext } from "./hooks/useProgramConfig";

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
    <SelectLabel label={title}>
      <Select
        selectedOption={selectedOption}
        options={options}
        onSelect={handleSelectChange}
      />
    </SelectLabel>
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

type FrequencyProps = {
  _totalSessionsPerWeek: number;
  _totalDoubleSessionsPerWeek: number;
};
export default function Frequency({
  _totalSessionsPerWeek,
  _totalDoubleSessionsPerWeek,
}: FrequencyProps) {
  const { handleFrequencyChange, split_sessions } = useTrainingProgramContext();
  const { frequency } = useProgramConfigContext();

  const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(
    frequency[0]
  );
  const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
    useState<number>(_totalDoubleSessionsPerWeek);
  const [selectedSplitType, setSelectedSplitType] =
    useState<SplitSessionsNameType>("OPT");

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      setTotalDoubleSessionsPerWeek(value);
    } else {
      setTotalSessionsPerWeek(value);
    }
  };

  const onSelectSplit = (type: SplitSessionsNameType) =>
    setSelectedSplitType(type);

  const onButtonClick = useCallback(() => {
    handleFrequencyChange(
      [totalSessionsPerWeek, totalDoubleSessionsPerWeek],
      selectedSplitType
    );
  }, [totalSessionsPerWeek, totalDoubleSessionsPerWeek, selectedSplitType]);

  return (
    <div className={`flex flex-col p-1`}>
      <div className={`pb-1 text-xs text-white`}>Frequency</div>
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
    </div>
  );
}
