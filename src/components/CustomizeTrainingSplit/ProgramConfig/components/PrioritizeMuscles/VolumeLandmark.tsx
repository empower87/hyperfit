import { useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { cn } from "~/lib/clsx";

type ButtonProps = {
  landmark: VolumeLandmarkType;
  selectedLandmark: VolumeLandmarkType;
  onSelect: (value: string) => void;
};

function Button(props: ButtonProps) {
  const { landmark, onSelect, selectedLandmark } = props;

  const selectedClasses = "border border-white font-bold px-1";
  return (
    <button
      className={cn(`m-0.5 text-white`, {
        [selectedClasses]: landmark === selectedLandmark,
      })}
      onClick={() => onSelect(landmark)}
    >
      {landmark}
    </button>
  );
}

VolumeLandmark.Button = Button;

type VolumeLandmarkProps = {
  landmark: VolumeLandmarkType;
  onSelectHandler: (value: VolumeLandmarkType) => void;
};
export default function VolumeLandmark({
  landmark,
  onSelectHandler,
}: VolumeLandmarkProps) {
  const [selectedLandmark, setSelectedLandmark] =
    useState<VolumeLandmarkType>(landmark);

  const onSelect = (value: string) => {
    const _value = value as VolumeLandmarkType;
    setSelectedLandmark(_value);
    onSelectHandler(_value);
  };
  return (
    <div className={" flex justify-evenly text-xxxs"}>
      <VolumeLandmark.Button
        landmark={"MRV"}
        onSelect={() => onSelect("MRV")}
        selectedLandmark={selectedLandmark}
      />
      <VolumeLandmark.Button
        landmark={"MEV"}
        onSelect={() => onSelect("MEV")}
        selectedLandmark={selectedLandmark}
      />
      <VolumeLandmark.Button
        landmark={"MV"}
        onSelect={() => onSelect("MV")}
        selectedLandmark={selectedLandmark}
      />
      {/* <div className="flex items-center justify-center">{volume}</div> */}
    </div>
  );
}

type SelectProps = {
  volume_landmark: VolumeLandmarkType;
  options: ["MRV", "MEV", "MV"];
  onSelect: (value: string) => void;
  bgColor: string;
};

export function Select({
  volume_landmark,
  options,
  onSelect,
  bgColor,
}: SelectProps) {
  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <select
      className={bgColor + " text-xxs font-bold text-white"}
      onChange={onSelectHandler}
    >
      {options.map((each) => {
        return (
          <option
            key={each}
            className={
              volume_landmark === each ? BG_COLOR_M5 : BG_COLOR_M6 + " "
            }
            value={each}
            selected={volume_landmark === each}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}
