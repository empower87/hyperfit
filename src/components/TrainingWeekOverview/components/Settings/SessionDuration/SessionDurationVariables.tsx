import { useEffect, useRef, useState } from "react";
import Settings from "~/components/Configuration/components/MusclePrioritization/Settings";
import { BG_COLOR_M5 } from "~/constants/themes";
import { cn } from "~/lib/clsx";
import { useSessionDurationVariablesContext } from "./sessionDurationVariablesContext";
import { DurationTimeConstantsKeys } from "./useSessionDurationVariables";

type TimeIncrementFrameProps = {
  label: DurationTimeConstantsKeys;
};

type IncrementBtnProps = {
  operation: "+" | "-";
  onClick: () => void;
};
const IncrementBtn = ({ operation, onClick }: IncrementBtnProps) => {
  return (
    <button
      className={cn(
        `${BG_COLOR_M5} m-1 flex h-4 w-4 items-center justify-center p-1 text-xs text-white`
      )}
      onClick={onClick}
    >
      {operation}
    </button>
  );
};

const TimeIncrementFrame = ({ label }: TimeIncrementFrameProps) => {
  const { durationTimeConstants, onTimeChange } =
    useSessionDurationVariablesContext();

  const [time, setTime] = useState<string>("00:00");
  const { value, min, max, increment } = durationTimeConstants[label];
  const timeInSecondsRef = useRef<number>(value);

  useEffect(() => {
    const formattedTime = formatTime(timeInSecondsRef.current);
    setTime(formattedTime);
  }, [timeInSecondsRef]);

  const onIncrement = (operation: "+" | "-") => {
    if (operation === "+") {
      if (timeInSecondsRef.current + increment > max) return;
      timeInSecondsRef.current = timeInSecondsRef.current + increment;
    } else {
      if (timeInSecondsRef.current - increment < min) return;
      timeInSecondsRef.current = timeInSecondsRef.current - increment;
    }
    const formattedTime = formatTime(timeInSecondsRef.current);
    setTime(formattedTime);
    onTimeChange(label, timeInSecondsRef.current);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex">
      <IncrementBtn operation={"-"} onClick={() => onIncrement("-")} />
      <div className="m-1 flex w-6 items-center justify-center text-xs text-white">
        {time}
      </div>
      <IncrementBtn operation={"+"} onClick={() => onIncrement("+")} />
    </div>
  );
};

export default function SessionDurationVariables() {
  return (
    <div className="flex flex-col">
      <div className="mb-0.5 flex items-center justify-center text-sm">
        Workout Duration Variables
      </div>
      <Settings>
        <Settings.Section title="Warmup">
          <TimeIncrementFrame label="warmup" />
        </Settings.Section>
        <Settings.Section title="Rest">
          <TimeIncrementFrame label="rest" />
        </Settings.Section>
        <Settings.Section title="Superset">
          <TimeIncrementFrame label="superset" />
        </Settings.Section>
        <Settings.Section title="Rep">
          <TimeIncrementFrame label="rep" />
        </Settings.Section>
      </Settings>
    </div>
  );
}
