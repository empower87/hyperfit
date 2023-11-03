import { useState } from "react";
import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { VolumeLandmarkType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { getVolumeSets } from "~/utils/musclePriorityHandlers";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M8 } from "~/utils/themes";
import MesocycleFrequency from "./components/MesocycleFrequency";
import { MesocycleVolumes } from "./components/MesocycleVolumes";

type SelectProps = {
  volume_landmark: VolumeLandmarkType;
  options: ["MRV", "MEV", "MV"];
  onSelect: (value: string) => void;
  bgColor: string;
};

function Select({ volume_landmark, options, onSelect, bgColor }: SelectProps) {
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
            selected={volume_landmark === each ? true : false}
          >
            {each}
          </option>
        );
      })}
    </select>
  );
}

const CELL_WIDTHS = [" w-1/12", " w-2/12", " w-2/12", " w-4/12", " w-3/12"];
const CELL_WIDTHS_ON_EDIT = [
  " w-1/12",
  " w-1/12",
  " w-2/12",
  " w-6/12",
  " w-2/12",
];

type ItemProps = {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
};

function Item({
  muscleGroup,
  index,
  onVolumeChange,
  total_sessions,
}: ItemProps) {
  const { mesoProgression, volume_landmark, muscle } = muscleGroup;

  const [cellWidths, setCellWidths] = useState<string[]>([...CELL_WIDTHS]);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const volumeSets = getVolumeSets(muscle, mesoProgression[2], volume_landmark);
  const bgColor = VOLUME_BG_COLORS[muscleGroup.volume_landmark];

  const onSelectHandler = (value: string) => {
    onVolumeChange(index, value as VolumeLandmarkType);
  };

  const changeCellWidthsHandler = (isEditing: boolean) => {
    if (isEditing) {
      setCellWidths([...CELL_WIDTHS_ON_EDIT]);
    } else {
      setCellWidths([...CELL_WIDTHS]);
    }
  };

  const onEditHandler = (isEditing: boolean) => {
    setIsEditing(isEditing);
    changeCellWidthsHandler(isEditing);
  };

  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5 text-white"}>
      <div className={cellWidths[0] + " indent-1"}>{index + 1}</div>

      <div className={cellWidths[1] + " indent-1"}>{muscle}</div>

      <div className={cellWidths[2] + " flex justify-evenly"}>
        <Select
          volume_landmark={volume_landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
        <div className=" ">{volumeSets}</div>
      </div>

      <MesocycleFrequency
        mesoProgression={mesoProgression}
        total_sessions={total_sessions}
        isEditing={isEditing}
        onEditHandler={onEditHandler}
        width={cellWidths[3]}
      />

      <MesocycleVolumes muscleGroup={muscleGroup} width={cellWidths[4]} />
    </li>
  );
}

type MusclePriorityListProps = {
  musclePriority: MusclePriorityType[];
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  total_sessions: [number, number];
};

export function MusclePriorityList({
  musclePriority,
  onVolumeChange,
  total_sessions,
}: MusclePriorityListProps) {
  const [cellWidths, setCellWidths] = useState<string[]>([...CELL_WIDTHS]);

  return (
    <div className=" w-3/4">
      <div className={BG_COLOR_M6 + " text-xxs mb-1 flex w-full text-white"}>
        <div
          className={BORDER_COLOR_M8 + cellWidths[0] + " border-r-2 indent-1"}
        >
          Rank
        </div>
        <div
          className={BORDER_COLOR_M8 + cellWidths[1] + " border-r-2 indent-1"}
        >
          Group
        </div>
        <div
          className={
            BORDER_COLOR_M8 + cellWidths[2] + " flex border-r-2 text-center"
          }
        >
          Volume Benchmark
        </div>
        <div
          className={
            BORDER_COLOR_M8 + cellWidths[3] + " flex flex-col border-r-2"
          }
        >
          <div className=" mb-0.5 flex w-full justify-center">
            Mesocycle Frequency
          </div>
          <div className=" flex w-full">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
        <div
          className={
            BORDER_COLOR_M8 + cellWidths[4] + " flex flex-col border-r-2"
          }
        >
          <div className=" mb-0.5 flex w-full justify-center">
            Mesocycle Total Vol.
          </div>
          <div className=" flex w-full">
            <div className=" flex w-1/3 justify-center">1</div>
            <div className=" flex w-1/3 justify-center">2</div>
            <div className=" flex w-1/3 justify-center">3</div>
          </div>
        </div>
      </div>

      <ul className=" flex flex-col">
        {musclePriority.map((each, index) => {
          return (
            <Item
              key={`${each.id}_MusclePriority`}
              muscleGroup={each}
              index={index}
              onVolumeChange={onVolumeChange}
              total_sessions={total_sessions}
            />
          );
        })}
      </ul>
    </div>
  );
}
