import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useProgramConfigContext } from "../hooks/useProgramConfig";

const OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];
// const OPTIONS = [1, 2, 3, 4, 5, 6, 7];

export default function FrequencySelection() {
  const { frequency, onFrequencyChange } = useProgramConfigContext();

  const handleSelectChange = useCallback((value: string) => {
    const numberValue = parseInt(value);
    onFrequencyChange([numberValue, frequency[1]]);
  }, []);

  const unselectedButtonClasses = "bg-card";
  const selectedButtonClasses = "scale-110 border-secondary-300";
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={OPTIONS[2]} />
          </SelectTrigger>
          <SelectContent>
            {OPTIONS.map((freq, index) => {
              return <SelectItem value={freq}>{freq}</SelectItem>;
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
// export default function FrequencySelection() {
//   const { frequency, onFrequencyChange } = useProgramConfigContext();

//   const handleSelectChange = useCallback(
//     (value: number) => {
//       onFrequencyChange([value, frequency[1]]);
//     },
//     [frequency, onFrequencyChange]
//   );

//   const unselectedButtonClasses = "bg-card";
//   const selectedButtonClasses = "scale-110 border-secondary-300";
//   return (
//     <div className="flex flex-col items-center">
//       <ul className="flex space-x-2">
//         {OPTIONS.map((option) => {
//           return (
//             <li className="" key={`frequency_day_${option}`}>
//               <Button
//                 variant="outline"
//                 className={
//                   option === frequency[0]
//                     ? selectedButtonClasses
//                     : unselectedButtonClasses
//                 }
//                 onClick={() => handleSelectChange(option)}
//               >
//                 <div
//                   className={`${
//                     option === frequency[0] ? "text-white" : "text-primary-300"
//                   }`}
//                 >
//                   {option}
//                 </div>
//               </Button>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }
