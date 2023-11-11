import { useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/utils/themes";

type VolumeSettingFrameProps = {
  title: string;
  breakpoint: number;
  // onChange: (value: number, other: string) => void;
  onChange: (type: "mrv_breakpoint" | "mev_breakpoint", value: number) => void;
};

function VolumeSettingFrame({
  title,
  breakpoint,
  onChange,
}: VolumeSettingFrameProps) {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<number>(breakpoint);

  const titleKey = title === "MRV -" ? "mrv_breakpoint" : "mev_breakpoint";
  const onSubtract = () => {
    setCurrentBreakpoint((prev) => prev - 1);
    onChange(titleKey, currentBreakpoint - 1);
  };
  const onAdd = () => {
    setCurrentBreakpoint((prev) => prev + 1);
    onChange(titleKey, currentBreakpoint + 1);
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

type ListVolumeSettingsProps = {
  mrvBreakpoint: number;
  mevBreakpoint: number;
  onBreakpointChange: (
    type: "mrv_breakpoint" | "mev_breakpoint",
    value: number
  ) => void;
};
export function ListVolumeSettings({
  mrvBreakpoint,
  mevBreakpoint,
  onBreakpointChange,
}: ListVolumeSettingsProps) {
  return (
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
    </div>
  );
}
type ActualSplitType = {
  lower: number;
  upper: number;
  push: number;
  pull: number;
  full: number;
  off: number;
};

type WeekVolumeDetailsProps = {
  entireVolume: number;
  splitVolume: { session: string; sets: number }[];
};
export function WeekVolumeDetails({
  entireVolume,
  splitVolume,
}: WeekVolumeDetailsProps) {
  // let values: string[] = [];
  // if (actualSplit) {
  //   Object.entries(actualSplit).map((each) => {
  //     let total = each[1];
  //     while (total > 0) {
  //       values.push(each[0]);
  //       total--;
  //     }
  //   });
  // }
  // setValues(values);
  return (
    <div className=" mb-2">
      <div className=" text-xxs text-white">Week Volume</div>
      <div className=" text-xxs text-white">{entireVolume}</div>
      {splitVolume.map((each, index) => {
        return (
          <div className=" text-xxs flex text-white">
            <div className=" mr-2">{each.session}</div>
            <div className="">{each.sets}</div>
          </div>
        );
      })}
    </div>
  );
}
