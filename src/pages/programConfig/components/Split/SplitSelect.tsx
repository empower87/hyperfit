// import { Select } from "~/components/Layout/Select";
import { memo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useProgramSettingsContext } from "../../hooks/useProgramSettings";

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
  const handleSelectChange = (value: string) => {
    const result: SplitSessionsNameType | undefined = (
      Object.keys(SPLITS) as (keyof typeof SPLITS)[]
    ).find((key) => key === value);
    if (!result) return;
    onSelect(result);
  };

  const options = Object.values(SPLITS);
  const selected = SPLITS[selectedOption];
  return (
    <div className="flex w-full">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={SPLITS.OPT} />
        </SelectTrigger>

        <SelectContent>
          {Object.entries(SPLITS).map((split, index) => {
            return <SelectItem value={split[0]}>{split[1]}</SelectItem>;
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

function SplitSelect() {
  const { split, onSplitChange } = useProgramSettingsContext();

  return (
    <div className={``}>
      <SelectSplit selectedOption={split} onSelect={onSplitChange} />
    </div>
  );
}
export default memo(SplitSelect);
