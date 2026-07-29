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
import { useProgramSettingsContext } from "~/hooks/programConfig/useProgramSettings";

const SPLITS = {
  OPT: "ULFB: Upper / Lower / Full Body",
  CUS: "CUS: Custom",
  PPL: "PPL: Push / Pull / Legs",
  UL: "UL: Upper / Lower",
  BRO: "BRO: Bro Split",
  PPLUL: "PPLUL: Push / Pull / Legs - Upper / Lower",
  FB: "FB: Full Body",
};

export type SelectObjectType = { [key: string]: string };

type ProgramSettingsSelectProps<T> = {
  onChange: (value: string) => void;
  placeholder: keyof T;
  items: T;
};

export function ProgramSettingsSelect({
  onChange,
  placeholder,
  items,
}: ProgramSettingsSelectProps<SelectObjectType>) {
  return (
    <div>
      <Select onValueChange={onChange}>
        <SelectTrigger className="w-[100px] py-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {Object.entries(items).map((item, index) => {
            return (
              <SelectItem
                key={`${item}_${index}_SplitSelectOptions`}
                value={item[0]}
              >
                {item[1]}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

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
    <ProgramSettingsSelect
      onChange={handleSelectChange}
      placeholder={SPLITS[split]}
      items={SPLITS}
    />
  );
}

// function SplitSelect() {
//   const { split, onSplitChange } = useProgramSettingsContext();

//   const handleSelectChange = (value: string) => {
//     const result: SplitSessionsNameType | undefined = (
//       Object.keys(SPLITS) as (keyof typeof SPLITS)[]
//     ).find((key) => key === value);
//     if (!result) return;
//     onSplitChange(result);
//   };

//   return (
//     <div className="flex">
//       <Select onValueChange={handleSelectChange}>
//         <SelectTrigger className="w-[60px]">
//           <SelectValue placeholder={SPLITS[split]} />
//         </SelectTrigger>

//         <SelectContent>
//           {Object.entries(SPLITS).map((split, index) => {
//             return (
//               <SelectItem
//                 key={`${split}_${index}_SplitSelectOptions`}
//                 value={split[0]}
//               >
//                 {split[1]}
//               </SelectItem>
//             );
//           })}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

export default memo(SplitSelect);
