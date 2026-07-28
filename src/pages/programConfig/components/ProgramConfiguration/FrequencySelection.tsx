import { memo, useCallback, useState } from "react";
import { useProgramSettingsContext } from "../../hooks/useProgramSettings";
import { ProgramSettingsSelect } from "./SplitSelect";

// const OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];
const OPTIONS = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
};

const FrequencySelection = () => {
  const { frequency, onFrequencyChange } = useProgramSettingsContext();
  const [selectedFrequency, setSelectedFrequency] = useState(frequency[0]);

  const handleSelectChange = useCallback(
    (value: string) => {
      const numberValue = parseInt(value);
      onFrequencyChange([numberValue, frequency[1]]);
    },
    [frequency]
  );

  return (
    <ProgramSettingsSelect
      onChange={handleSelectChange}
      placeholder={selectedFrequency.toString()}
      items={OPTIONS}
    />
  );
};

// const FrequencySelection = () => {
//   const { frequency, onFrequencyChange } = useProgramSettingsContext();
//   const [selectedFrequency, setSelectedFrequency] = useState(frequency[0]);

//   const handleSelectChange = useCallback(
//     (value: string) => {
//       const numberValue = parseInt(value);
//       onFrequencyChange([numberValue, frequency[1]]);
//     },
//     [frequency]
//   );

//   return (
//     <div className="flex">
//       <Select onValueChange={handleSelectChange}>
//         <SelectTrigger className="w-[50px]">
//           <SelectValue placeholder={selectedFrequency} />
//         </SelectTrigger>

//         <SelectContent>
//           {OPTIONS.map((freq, index) => {
//             return (
//               <SelectItem
//                 key={`${freq}_${index}_FrequencySelectionOption`}
//                 value={freq}
//               >
//                 {freq}
//               </SelectItem>
//             );
//           })}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// };

export default memo(FrequencySelection);
