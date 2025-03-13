import { memo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useProgramSettingsContext } from "../hooks/useProgramSettings";

const OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

const FrequencySelection = () => {
  const { frequency, onFrequencyChange } = useProgramSettingsContext();

  const handleSelectChange = useCallback(
    (value: string) => {
      const numberValue = parseInt(value);
      onFrequencyChange([numberValue, frequency[1]]);
    },
    [frequency]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[140px]">
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
};

export default memo(FrequencySelection);
