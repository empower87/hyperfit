import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";

type VolumeSettingFrameProps = {
  title: "MRV" | "MEV";
  breakpoint: number;
  onChange: (type: "MRV" | "MEV", value: number) => void;
};

function VolumeSettingFrame({
  title,
  breakpoint,
  onChange,
}: VolumeSettingFrameProps) {
  const textColor = getRankColor(title);
  return (
    <div className={cn(`bg-primary-600 flex justify-between text-xxs`)}>
      <div
        className={cn(
          `flex items-center justify-center px-1 indent-1 font-bold ${textColor.text}`
        )}
      >
        {title}
      </div>
      <div className="flex">
        <button
          className={
            "bg-primary-500 flex h-4 w-4 items-center justify-center text-xxs font-bold text-slate-300"
          }
          onClick={() => onChange(title, breakpoint - 1)}
        >
          -
        </button>
        <div className=" flex h-4 w-4 items-center justify-center text-white">
          {breakpoint}
        </div>
        <button
          onClick={() => onChange(title, breakpoint + 1)}
          className={
            "bg-primary-500 flex h-4 w-4 items-center justify-center text-xxs font-bold text-slate-300"
          }
        >
          +
        </button>
      </div>
    </div>
  );
}

export function Breakpoints() {
  const { onBreakpointChange, volumeBreakpoints } = useProgramConfigContext();
  return (
    <div className={`flex space-x-1 p-1`}>
      <VolumeSettingFrame
        title="MRV"
        breakpoint={volumeBreakpoints[0]}
        onChange={onBreakpointChange}
      />
      <VolumeSettingFrame
        title="MEV"
        breakpoint={volumeBreakpoints[1]}
        onChange={onBreakpointChange}
      />
    </div>
  );
}

function ToggleButton({
  title,
  isToggled,
  onClick,
}: {
  title: string;
  isToggled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `rounded border-primary-600 flex items-center justify-center border px-1 py-0.5 hover:bg-primary-500`,
        { ["border-white bg-rose-400"]: isToggled }
      )}
    >
      <div className={`text-[.5rem] text-white`}>{title}</div>
    </button>
  );
}

export function Toggles() {
  const { onToggleBreakpoints, volumeBreakpoints } = useProgramConfigContext();

  const isMEVToggled =
    volumeBreakpoints[0] === 0 && volumeBreakpoints[1] === 14;
  const isMVToggled = volumeBreakpoints[0] === 0 && volumeBreakpoints[1] === 0;
  return (
    <div className={`flex space-x-1 p-1`}>
      <ToggleButton
        title="All MEV"
        isToggled={isMEVToggled}
        onClick={() => onToggleBreakpoints("All MEV")}
      />
      <ToggleButton
        title="All MV"
        isToggled={isMVToggled}
        onClick={() => onToggleBreakpoints("All MV")}
      />
    </div>
  );
}
