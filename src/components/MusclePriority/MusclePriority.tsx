import { useState } from "react";
import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
  VolumeLandmark,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M8 } from "~/utils/themes";
import Section from "../Layout/Section";

type SelectProps = {
  volume_landmark: VolumeLandmark;
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
      className={bgColor + " text-xs font-bold text-white"}
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

function Item({
  muscleGroup,
  index,
  onVolumeChange,
}: {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (index: number, newVolume: VolumeLandmark) => void;
}) {
  const [volume, setVolume] = useState<VolumeLandmark>(
    muscleGroup.volume_landmark
  );

  const bgColor = VOLUME_BG_COLORS[muscleGroup.volume_landmark];

  const onSelectHandler = (value: string) => {
    onVolumeChange(index, value as VolumeLandmark);
  };

  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5"}>
      <div className=" w-1/12 indent-1">{index + 1}</div>
      <div className=" w-5/12 indent-1">{muscleGroup.muscle}</div>
      <div className=" flex w-2/12 justify-center">
        <Select
          volume_landmark={muscleGroup.volume_landmark}
          options={["MRV", "MEV", "MV"]}
          onSelect={onSelectHandler}
          bgColor={bgColor}
        />
      </div>
      <div className=" flex w-4/12">
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[0]}
        </div>
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[1]}
        </div>
        <div className=" flex w-1/3 justify-center">
          {muscleGroup.mesoProgression[2]}
        </div>
      </div>
    </li>
  );
}

type VolumeSettingFrameProps = {
  title: string;
  breakpoint: number;
};
function VolumeSettingFrame({ title, breakpoint }: VolumeSettingFrameProps) {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<number>(breakpoint);

  const onSubtract = () => {
    setCurrentBreakpoint((prev) => prev - 1);
  };
  const onAdd = () => {
    setCurrentBreakpoint((prev) => prev + 1);
  };
  return (
    <div className={BG_COLOR_M6 + " mb-1 flex justify-between"}>
      <div className=" text-xxs p-1 indent-1 text-white">{title}</div>
      <div className=" flex">
        <button
          className={
            BG_COLOR_M5 +
            " flex h-6 w-6 items-center justify-center font-bold text-slate-300"
          }
          onClick={onSubtract}
        >
          -
        </button>
        <div className=" text-xxs flex h-6 w-6 items-center justify-center text-white">
          {currentBreakpoint}
        </div>
        <button
          onClick={onAdd}
          className={
            BG_COLOR_M5 +
            " flex h-6 w-6 items-center justify-center font-bold text-slate-300"
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
type MusclePriorityProps = {
  list: MusclePriorityType[];
};

export function MusclePriority({ list }: MusclePriorityProps) {
  const [musclePriority, setMusclePriority] = useState<MusclePriorityType[]>([
    ...list,
  ]);

  const [volumeBreakpoints, setVolumeBreakpoints] = useState<[number, number]>([
    4, 9,
  ]);

  const onVolumeChange = (index: number, newVolume: VolumeLandmark) => {
    const items = [...musclePriority];
    const sourceIndex = index;
    let destinationIndex = 0;
    switch (newVolume) {
      case "MRV":
        destinationIndex = volumeBreakpoints[0];
      case "MEV":
        if (sourceIndex < volumeBreakpoints[0]) {
          destinationIndex = volumeBreakpoints[0];
        } else if (sourceIndex >= volumeBreakpoints[1]) {
          destinationIndex = volumeBreakpoints[1] - 1;
        }
      default:
        destinationIndex = volumeBreakpoints[1];
    }
    const [removed] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, removed);
    setMusclePriority(items);
  };

  return (
    <div className=" flex">
      <div className=" w-1/3 pr-3">
        <Section title="Volume Settings">
          <div>
            <VolumeSettingFrame
              title="MRV -"
              breakpoint={volumeBreakpoints[0]}
            />
            <VolumeSettingFrame
              title="MEV -"
              breakpoint={volumeBreakpoints[1]}
            />
            {/* <VolumeSettingFrame title="MV - Maintenance Volume" breakpoint={14} /> */}
          </div>
        </Section>
      </div>

      <div className=" w-2/3">
        <div className={BG_COLOR_M6 + " text-xxs mb-1 flex text-white"}>
          <div className={BORDER_COLOR_M8 + " w-1/12 border-r-2 indent-1"}>
            Rank
          </div>
          <div className={BORDER_COLOR_M8 + " w-5/12 border-r-2 indent-1"}>
            Group
          </div>
          <div
            className={BORDER_COLOR_M8 + " flex w-2/12 border-r-2 text-center"}
          >
            Volume Indicator
          </div>
          <div className=" flex w-4/12 flex-col">
            <div className=" mb-0.5 flex justify-center">
              Mesocycle Frequency
            </div>
            <div className=" flex">
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
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
