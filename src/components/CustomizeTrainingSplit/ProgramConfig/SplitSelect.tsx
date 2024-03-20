import { Select } from "~/components/Layout/Select";
import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useProgramConfigContext } from "./hooks/useProgramConfig";

type SelectSplitProps = {
  selectedOption: SplitSessionsNameType;
  onSelect: (type: SplitSessionsNameType) => void;
};

const SPLITS = {
  OPT: "optimized",
  CUS: "custom",
  PPL: "push / pull / legs",
  UL: "upper / lower",
  BRO: "bro",
  PPLUL: "push / pull / legs - upper / lower",
  FB: "full body",
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

export default function SplitSelect() {
  const { split, onSplitChange } = useProgramConfigContext();

  return (
    <div className={``}>
      <SelectSplit selectedOption={split} onSelect={onSplitChange} />
    </div>
  );
}
