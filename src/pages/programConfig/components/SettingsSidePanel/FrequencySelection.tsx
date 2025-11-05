import { memo, useCallback, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useProgramSettingsContext } from "../../hooks/useProgramSettings";

const OPTIONS = ["1", "2", "3", "4", "5", "6", "7"];

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
    <div className="flex flex-col items-center">
      <div className="flex w-full">
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={selectedFrequency} />
          </SelectTrigger>

          <SelectContent>
            {OPTIONS.map((freq, index) => {
              return (
                <SelectItem
                  key={`${freq}_${index}_FrequencySelectionOption`}
                  value={freq}
                >
                  {freq}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default memo(FrequencySelection);
