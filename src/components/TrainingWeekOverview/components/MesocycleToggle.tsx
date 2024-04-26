import { HTMLAttributes, ReactNode } from "react";
import {
  BG_COLOR_M6,
  BG_COLOR_M7,
  BG_COLOR_M8,
  BORDER_COLOR_M8,
} from "~/constants/themes";
import { cn } from "~/lib/clsx";

interface ToggleProps extends HTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  children: ReactNode;
}

function Toggle({ selected, children, ...props }: ToggleProps) {
  return (
    <button
      className={cn(
        `flex cursor-pointer items-center justify-center px-2 text-sm last:rounded-r ${BG_COLOR_M7} hover:${BG_COLOR_M6}`,
        {
          [`${BG_COLOR_M6} text-white`]: selected,
          [`${BG_COLOR_M7} text-slate-400`]: !selected,
        }
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type ToggleLayoutProps = {
  label: string;
  children: ReactNode;
};
function ToggleLayout({ label, children }: ToggleLayoutProps) {
  return (
    <div className={`flex justify-center rounded border ${BORDER_COLOR_M8}`}>
      <div
        className={`flex items-center justify-center px-2 py-1 text-sm text-white ${BG_COLOR_M8}`}
      >
        {label}
      </div>

      <div className={`flex space-x-1`}>{children}</div>
    </div>
  );
}

type MesocycleToggleProps = {
  mesocycles: string[];
  microcycles: string[];
  selectedMesocycleIndex: number;
  selectedMicrocycleIndex: number;
  onClickHandler: (value: string) => void;
};

export default function MesocycleToggle({
  mesocycles,
  microcycles,
  selectedMesocycleIndex,
  selectedMicrocycleIndex,
  onClickHandler,
}: MesocycleToggleProps) {
  const selectedMesocycle = mesocycles[selectedMesocycleIndex];
  const selectedMicrocycle = microcycles[selectedMicrocycleIndex];
  return (
    <div className={`flex w-full items-center space-x-2 rounded p-2`}>
      <ToggleLayout label="Mesocycle">
        {mesocycles.map((each, index) => {
          const isSelected = selectedMesocycle === each;
          return (
            <Toggle
              key={`${each}_${index}_MesocyclesTitles`}
              selected={isSelected}
              onClick={() => onClickHandler(each)}
            >
              {index + 1}
            </Toggle>
          );
        })}
      </ToggleLayout>

      <ToggleLayout label="Week">
        {microcycles.map((each, index) => {
          const isSelected = selectedMicrocycle === each;
          return (
            <Toggle
              key={`${each}_${index}_MicrocyclesTitles`}
              selected={isSelected}
              onClick={() => onClickHandler(each)}
            >
              {index + 1}
            </Toggle>
          );
        })}
      </ToggleLayout>
    </div>
  );
}
