import { useCallback, useEffect, useState } from "react";
import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { VolumeLandmarkType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import {
  getEndOfMesocycleThreeVolume,
  updateMusclePriorityVolume,
} from "~/utils/musclePriorityHandlers";
import { BG_COLOR_M5, BG_COLOR_M6, BORDER_COLOR_M8 } from "~/utils/themes";
import Section from "../Layout/Section";

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
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
}) {
  const [volume, setVolume] = useState<VolumeLandmarkType>(
    muscleGroup.volume_landmark
  );

  const bgColor = VOLUME_BG_COLORS[muscleGroup.volume_landmark];

  const onSelectHandler = (value: string) => {
    onVolumeChange(index, value as VolumeLandmarkType);
  };

  const totalVolume = getEndOfMesocycleThreeVolume(
    muscleGroup.mesoProgression[2],
    muscleGroup.volume_landmark,
    muscleGroup.muscle
  );
  return (
    <li className={bgColor + " text-xxs mb-0.5 flex p-0.5"}>
      <div className=" w-1/12 indent-1">{index + 1}</div>
      <div className=" w-4/12 indent-1">{muscleGroup.muscle}</div>
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
      <div className=" flex w-1/12 justify-center">{totalVolume}</div>
    </li>
  );
}

type VolumeSettingFrameProps = {
  title: string;
  breakpoint: number;
  onChange: (value: number, other: string) => void;
};
function VolumeSettingFrame({
  title,
  breakpoint,
  onChange,
}: VolumeSettingFrameProps) {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<number>(breakpoint);

  const onSubtract = () => {
    setCurrentBreakpoint((prev) => prev - 1);
    onChange(currentBreakpoint - 1, title);
  };
  const onAdd = () => {
    setCurrentBreakpoint((prev) => prev + 1);
    onChange(currentBreakpoint + 1, title);
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

  const onVolumeChange = useCallback(
    (index: number, newVolume: VolumeLandmarkType) => {
      const items = [...musclePriority];

      let destinationIndex = 0;

      console.log(index, newVolume, "this must be wrong");
      switch (newVolume) {
        case "MRV":
          if (index > volumeBreakpoints[1]) {
            destinationIndex = volumeBreakpoints[1] - 1;
          } else {
            destinationIndex = volumeBreakpoints[0] - 1;
          }
          break;
        case "MEV":
          if (index < volumeBreakpoints[0]) {
            destinationIndex = volumeBreakpoints[0];
          } else if (index >= volumeBreakpoints[1]) {
            destinationIndex = volumeBreakpoints[1] - 1;
          }
          break;
        default:
          destinationIndex = volumeBreakpoints[1];
      }
      const [removed] = items.splice(index, 1);
      items.splice(destinationIndex, 0, removed);

      const updateItems = updateMusclePriorityVolume(
        items,
        volumeBreakpoints[0],
        volumeBreakpoints[1]
      );
      setMusclePriority(updateItems);
    },
    [musclePriority]
  );

  const onBreakpointChange = (value: number, other: string) => {
    const breakpointIndex = other === "MRV -" ? 0 : 1;
    let newVolumeBreakpoint: [number, number] = [...volumeBreakpoints];
    newVolumeBreakpoint[breakpointIndex] = value;
    setVolumeBreakpoints(newVolumeBreakpoint);
  };

  useEffect(() => {
    const updateItems = updateMusclePriorityVolume(
      musclePriority,
      volumeBreakpoints[0],
      volumeBreakpoints[1]
    );
    setMusclePriority(updateItems);
  }, [volumeBreakpoints]);
  return (
    <div className=" flex">
      <div className=" w-1/3 pr-3">
        <Section title="Volume Settings">
          <div>
            <VolumeSettingFrame
              title="MRV -"
              breakpoint={volumeBreakpoints[0]}
              onChange={onBreakpointChange}
            />
            <VolumeSettingFrame
              title="MEV -"
              breakpoint={volumeBreakpoints[1]}
              onChange={onBreakpointChange}
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
          <div className={BORDER_COLOR_M8 + " w-4/12 border-r-2 indent-1"}>
            Group
          </div>
          <div
            className={BORDER_COLOR_M8 + " flex w-2/12 border-r-2 text-center"}
          >
            Volume Indicator
          </div>
          <div className={BORDER_COLOR_M8 + " flex w-4/12 flex-col border-r-2"}>
            <div className=" mb-0.5 flex justify-center">
              Mesocycle Frequency
            </div>
            <div className=" flex">
              <div className=" flex w-1/3 justify-center">1</div>
              <div className=" flex w-1/3 justify-center">2</div>
              <div className=" flex w-1/3 justify-center">3</div>
            </div>
          </div>
          <div className=" flex w-1/12">Total Volume</div>
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
