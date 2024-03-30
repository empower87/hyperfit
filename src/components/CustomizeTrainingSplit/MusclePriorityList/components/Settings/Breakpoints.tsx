import { useState } from "react";
import { BG_COLOR_M5, BG_COLOR_M6 } from "~/constants/themes";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";

type VolumeSettingFrameProps = {
  title: string;
  breakpoint: number;
  onChange: (type: "mrv_breakpoint" | "mev_breakpoint", value: number) => void;
};

function VolumeSettingFrame({
  title,
  breakpoint,
  onChange,
}: VolumeSettingFrameProps) {
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<number>(breakpoint);

  const titleKey = title === "MRV" ? "mrv_breakpoint" : "mev_breakpoint";
  const onSubtract = () => {
    setCurrentBreakpoint((prev) => prev - 1);
    onChange(titleKey, currentBreakpoint - 1);
  };
  const onAdd = () => {
    setCurrentBreakpoint((prev) => prev + 1);
    onChange(titleKey, currentBreakpoint + 1);
  };

  return (
    <div className={cn(`${BG_COLOR_M6} flex justify-between text-[0.50rem]`)}>
      <div
        className={cn(
          `flex items-center justify-center px-1 indent-1 font-bold text-orange-500`,
          {
            ["text-red-500"]: title === "MRV",
          }
        )}
      >
        {title}
      </div>
      <div className="flex">
        <button
          className={
            BG_COLOR_M5 +
            " flex h-4 w-4 items-center justify-center text-xxs font-bold text-slate-300"
          }
          onClick={onSubtract}
        >
          -
        </button>
        <div className=" flex h-4 w-4 items-center justify-center text-white">
          {currentBreakpoint}
        </div>
        <button
          onClick={onAdd}
          className={
            BG_COLOR_M5 +
            " flex h-4 w-4 items-center justify-center text-xxs font-bold text-slate-300"
          }
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Breakpoints() {
  const { mrv_breakpoint, mev_breakpoint, handleUpdateBreakpoint } =
    useTrainingProgramContext();
  return (
    <div className={`flex space-x-1 p-1`}>
      <VolumeSettingFrame
        title="MRV"
        breakpoint={mrv_breakpoint}
        onChange={handleUpdateBreakpoint}
      />
      <VolumeSettingFrame
        title="MEV"
        breakpoint={mev_breakpoint}
        onChange={handleUpdateBreakpoint}
      />
    </div>
  );
}
