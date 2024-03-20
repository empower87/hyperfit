import { Select, SelectLabel } from "~/components/Layout/Select";
import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
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

export default function Frequency() {
  const { frequency, onFrequencyChange } = useProgramConfigContext();

  // const [totalSessionsPerWeek, setTotalSessionsPerWeek] = useState<number>(
  //   frequency[0]
  // );
  // const [totalDoubleSessionsPerWeek, setTotalDoubleSessionsPerWeek] =
  //   useState<number>(_totalDoubleSessionsPerWeek);
  // const [selectedSplitType, setSelectedSplitType] =
  //   useState<SplitSessionsNameType>("OPT");

  const handleSelectChange = (value: number, type: "week" | "day") => {
    if (type === "day") {
      onFrequencyChange([frequency[0], value]);
    } else {
      onFrequencyChange([value, frequency[1]]);
      // setTotalSessionsPerWeek(value);
    }
  };

  // const onSelectSplit = (type: SplitSessionsNameType) =>
  //   setSelectedSplitType(type);

  // const onButtonClick = useCallback(() => {
  //   handleFrequencyChange(
  //     [totalSessionsPerWeek, totalDoubleSessionsPerWeek],
  //     selectedSplitType
  //   );
  // }, [totalSessionsPerWeek, totalDoubleSessionsPerWeek, selectedSplitType]);

  return (
    <div className={`flex flex-col p-1`}>
      <div className={`pb-1 text-xs text-white`}>Frequency</div>
      <SelectFrequency
        title="Weekly Sessions: "
        options={[...OPTIONS].slice(3)}
        selectedOption={frequency[0]}
        onChange={handleSelectChange}
      />

      <SelectFrequency
        title="Daily Sessions: "
        options={[...OPTIONS].slice(0, frequency[0] + 1)}
        selectedOption={frequency[1]}
        onChange={handleSelectChange}
      />
    </div>
  );
}

// CHRISTINA'S PROGRAM

// upper
// 3x back      8-12 t-bar rows
// 2x back      8-12 cable pullovers
// 3x chest     8-12 chest press
// 3x triceps   8-12 overhead cable extension
// 3x biceps    8-12 preacher curl

// lower
// 3x quads     5-8 leg press
// 3x calves    12-15 leg press calves
// 2x quads     12-15 reverse nordic curl
// 3x hams      5-8 romanian deadlifts
// 3x glutes    5-8 hip thrust machine
// 3x abs       machine abs

// upper
// 3x back      7-10 pulldowns
// 3x chest     7-10 incline DB press
// 2x back      7-10 incline DB rows
// 3x shoulders 7-10 seated DB overhead press
// 2x biceps    8-12 incline DB curl

// lower
// 3x quads     3-6 deadlifts
// 2x quads     8-12 hack squats
// 3x glutes    8-12 hip thrust machine
// 3x hams      7-10 smith machine good morning
// 3x abs       machine abs

// full
// 2x quads     5-8 smith machine squat
// 2x back      7-10 DB pullovers
// 2x hams      8-12 seated leg curl
// 2x triceps   8-12 close-grip bench press
// 2x back      8-12 assisted pull up
