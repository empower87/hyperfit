import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "~/lib/clsx";
import { useSessionDurationVariablesContext } from "./sessionDurationVariablesContext";
import { DurationTimeConstantsKeys } from "./useSessionDurationVariables";

import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Breakpoints, Toggles } from "./Breakpoints";

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
        `m-1 flex h-4 w-4 items-center justify-center bg-primary-500 p-1 text-xs text-white`
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

  const capLabel = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <div className="flex items-center justify-center">
      <SessionDurationButton operation={"-"} onClick={() => onIncrement("-")} />
      <div className="mx-2 my-1 flex flex-col items-center justify-center text-white">
        <div className="">{time}</div>
        <div className="text-xs text-primary-300">{capLabel}</div>
      </div>
      <SessionDurationButton operation={"+"} onClick={() => onIncrement("+")} />
    </div>
  );
};

type SessionDurationButtonProps = {
  operation: "+" | "-";
  onClick: (operation: "+" | "-") => void;
};

function SessionDurationButton({
  operation,
  onClick,
}: SessionDurationButtonProps) {
  return (
    <Button
      size="icon"
      variant="outline"
      className="w-6 rounded-full"
      onClick={() => onClick(operation)}
    >
      {operation === "+" ? (
        <PlusIcon fill="white" />
      ) : (
        <MinusIcon fill="white" />
      )}
    </Button>
  );
}

export default function SessionDurationVariables() {
  return (
    <div className="flex w-96 flex-col">
      <div className="flex items-center justify-start px-2 pb-1 pt-2 text-sm">
        Workout Duration Variables
      </div>

      <Settings>
        <TimeIncrementFrame label="warmup" />
        <TimeIncrementFrame label="rest" />
        <TimeIncrementFrame label="superset" />
        <TimeIncrementFrame label="rep" />
      </Settings>
    </div>
  );
}

type SettingsProps = {
  children: ReactNode;
};
type SectionProps = SettingsProps & {
  title: string;
  variant?: "dark" | "light";
};

function Section({ title, variant, children }: SectionProps) {
  const variants =
    variant === "dark"
      ? { border: "border-primary-700", bg: "bg-primary-700" }
      : variant === "light"
      ? { border: "border-primary-500", bg: "bg-primary-500" }
      : { border: "border-primary-600", bg: "bg-primary-600" };
  return (
    <div className={`flex flex-col rounded border ${variants.border}`}>
      <div
        className={`flex items-center justify-center px-2 py-0.5 text-xs text-slate-300 ${variants.bg}`}
      >
        {title}
      </div>

      <div className={`flex space-x-1`}>{children}</div>
    </div>
  );
}

Settings.Breakpoints = Breakpoints;
Settings.Toggles = Toggles;
Settings.Section = Section;
export function Settings({ children }: SettingsProps) {
  return <div className={cn(`flex space-x-2 p-2 pt-0`)}>{children}</div>;
}
