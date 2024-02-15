import { useState } from "react";
import { VolumeLandmarkType } from "~/hooks/useTrainingProgram/reducer/trainingProgramUtils";
import { cn } from "~/lib/clsx";

type ButtonProps = {
  landmark: VolumeLandmarkType;
  selectedLandmark: VolumeLandmarkType;
  onSelect: (value: string) => void;
};

function Button(props: ButtonProps) {
  const { landmark, onSelect, selectedLandmark } = props;

  const selectedClasses = "border-2 border-white font-bold p-0.5";
  return (
    <button
      className={cn(`m-0.5 text-xxs text-white`, {
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
  width: string;
  onSelectHandler: (value: VolumeLandmarkType) => void;
  volume: number;
};
export default function VolumeLandmark({
  landmark,
  width,
  onSelectHandler,
  volume,
}: VolumeLandmarkProps) {
  const [selectedLandmark, setSelectedLandmark] =
    useState<VolumeLandmarkType>(landmark);

  const onSelect = (value: string) => {
    const _value = value as VolumeLandmarkType;
    setSelectedLandmark(_value);
    onSelectHandler(_value);
  };
  return (
    <div className={" flex justify-evenly text-xxs"} style={{ width: width }}>
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
      <div className="flex items-center justify-center">{volume}</div>
    </div>
  );
}
