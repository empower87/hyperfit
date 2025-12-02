import { memo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const VOLUMES = {
  LOW: "Low - 5-10 sets/week",
  MOD: "Moderate - 10-15 sets/week",
  HIGH: "High - 15-20 sets/week",
  EXTREME: "Extreme - 20+ sets/week",
};
type VolumesKeyType = keyof typeof VOLUMES;
function VolumeSelect() {
  const [volume, setVolume] = useState<VolumesKeyType>("MOD");

  const handleSelectChange = (value: string) => {
    const result: VolumesKeyType | undefined = (
      Object.keys(VOLUMES) as (keyof typeof VOLUMES)[]
    ).find((key) => key === value);
    if (!result) return;
    setVolume(result);
  };

  return (
    <div className="flex">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder={VOLUMES[volume]} />
        </SelectTrigger>

        <SelectContent>
          {Object.entries(VOLUMES).map((volume, index) => {
            return (
              <SelectItem
                key={`${volume}_${index}_VolumeSelectOptions`}
                value={volume[0]}
              >
                {volume[1]}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}

export default memo(VolumeSelect);
