import { useState } from "react";
import {
  MusclePriorityType,
  VOLUME_BG_COLORS,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { VolumeLandmarkType } from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitUtils";
import { getEndOfMesocycleThreeVolume } from "~/utils/musclePriorityHandlers";
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
  totalVolume,
}: {
  muscleGroup: MusclePriorityType;
  index: number;
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  totalVolume: number;
}) {
  const bgColor = VOLUME_BG_COLORS[muscleGroup.volume_landmark];

  const onSelectHandler = (value: string) => {
    onVolumeChange(index, value as VolumeLandmarkType);
  };

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
  musclePriority: MusclePriorityType[];
  total_sessions: [number, number];
  onBreakpointChange: (value: number, other: string) => void;
  onVolumeChange: (index: number, newVolume: VolumeLandmarkType) => void;
  mrvBreakpoint: number;
  mevBreakpoint: number;
  entireVolume: number;
  splitVolume: { session: string; sets: number }[];
};

export function MusclePriority({
  musclePriority,
  total_sessions,
  onBreakpointChange,
  onVolumeChange,
  mrvBreakpoint,
  mevBreakpoint,
  entireVolume,
  splitVolume,
}: MusclePriorityProps) {
  return (
    <div className=" mb-2 flex">
      <div className=" w-1/3 pr-3">
        <Section title="Volume Settings">
          <div>
            <VolumeSettingFrame
              title="MRV -"
              breakpoint={mrvBreakpoint}
              onChange={onBreakpointChange}
            />
            <VolumeSettingFrame
              title="MEV -"
              breakpoint={mevBreakpoint}
              onChange={onBreakpointChange}
            />
            {/* <VolumeSettingFrame title="MV - Maintenance Volume" breakpoint={14} /> */}
          </div>

          <div>
            <div className=" text-xxs text-white">Week Volume</div>
            <div className=" text-xxs text-white">{entireVolume}</div>
            {splitVolume.map((each) => {
              return (
                <div className=" text-xxs flex text-white">
                  <div className=" mr-2">{each.session}</div>
                  <div className="">{each.sets}</div>
                </div>
              );
            })}
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
            const totalVolume = getEndOfMesocycleThreeVolume(
              each.mesoProgression[2],
              each.volume_landmark,
              each.muscle
            );

            return (
              <Item
                key={`${each.id}_MusclePriority`}
                muscleGroup={each}
                index={index}
                onVolumeChange={onVolumeChange}
                totalVolume={totalVolume}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
}
