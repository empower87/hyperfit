// import { Select } from "~/components/Layout/Select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SplitSessionsNameType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";

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
  const handleSelectChange = (event: string) => {
    // const value = event.target.value;
    const result: SplitSessionsNameType | undefined = (
      Object.keys(SPLITS) as (keyof typeof SPLITS)[]
    ).find((key) => SPLITS[key] === event);
    console.log(result, event, "WHAT?");
    if (!result) return;
    onSelect(result);
  };
  // const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   const result: SplitSessionsNameType | undefined = (
  //     Object.keys(SPLITS) as (keyof typeof SPLITS)[]
  //   ).find((key) => SPLITS[key] === value);
  //   if (!result) return;
  //   onSelect(result);
  // };

  const options = Object.values(SPLITS);
  const selected = SPLITS[selectedOption];
  return (
    <div className="flex w-full">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={SPLITS.OPT} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SPLITS).map((split, index) => {
            return (
              <SelectItem
                value={split[0]}
                onSelect={() => handleSelectChange(split[0])}
              >
                {split[1]}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {/* <Select
        selectedOption={selected}
        options={options}
        onSelect={handleSelectChange}
        className={`outline-none`}
      /> */}
    </div>
  );
}

export default function SplitSelect() {
  const { split_sessions, onSplitChange } = useProgramConfigContext();

  return (
    <div className={``}>
      <SelectSplit
        selectedOption={split_sessions.split}
        onSelect={onSplitChange}
      />
    </div>
  );
}
