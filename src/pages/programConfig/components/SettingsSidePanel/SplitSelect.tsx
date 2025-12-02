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
  OPT: "Upper / Lower / Full Body",
  CUS: "Custom",
  PPL: "Push / Pull / Legs",
  UL: "Upper / Lower",
  BRO: "Bro",
  PPLUL: "Push / Pull / Legs - Upper / Lower",
  FB: "Full Body",
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
    <div className="flex">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[120px]">
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
