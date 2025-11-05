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

const SPLITS = {
  OPT: "upper / lower - full",
  CUS: "custom",
  PPL: "push / pull / legs",
  UL: "upper / lower",
  BRO: "bro",
  PPLUL: "push / pull / legs - upper / lower",
  FB: "full body",
};

function SplitSelect() {
  const { split, onSplitChange } = useProgramSettingsContext();

  const handleSelectChange = (value: string) => {
    const result: SplitSessionsNameType | undefined = (
      Object.keys(SPLITS) as (keyof typeof SPLITS)[]
    ).find((key) => key === value);
    if (!result) return;
    onSplitChange(result);
  };

  return (
    <div className="flex w-full">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={SPLITS[split]} />
        </SelectTrigger>

        <SelectContent>
          {Object.entries(SPLITS).map((split, index) => {
            return (
              <SelectItem
                key={`${split}_${index}_SplitSelectOptions`}
                value={split[0]}
              >
                {split[1]}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default memo(SplitSelect);
