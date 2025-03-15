import { HTMLAttributes, ReactNode } from "react";
import { cn } from "~/lib/clsx";
import { useToggleCyclesContext } from "../../../MesocycleToggle/hooks/useMesocycleToggle";

interface ToggleProps extends HTMLAttributes<HTMLButtonElement> {
  selected: boolean;
  children: ReactNode;
}

function Toggle({ selected, children, ...props }: ToggleProps) {
  return (
    <button
      className={cn(
        `flex cursor-pointer items-center justify-center bg-primary-700 px-2 text-sm last:rounded-r hover:bg-primary-500`,
        {
          [`bg-primary-500 text-white`]: selected,
          [`bg-primary-600 text-slate-400`]: !selected,
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
    <div className={`flex justify-center rounded border border-primary-700`}>
      <div
        className={`flex items-center justify-center bg-primary-700 px-2 py-1 text-sm text-white`}
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

export const ToggleCycles = () => {
  const {
    mesocycle_array,
    microcycle_array,
    selectedMesocycle,
    selectedMicrocycle,
    onSelectMesocycle,
    onSelectMicrocycle,
  } = useToggleCyclesContext();

  return (
    <div className={`flex w-full items-center space-x-2 rounded p-2`}>
      <ToggleLayout label="Mesocycle">
        {mesocycle_array.map((each, index) => {
          const isSelected = selectedMesocycle === index;
          return (
            <Toggle
              key={`${each}_${index}_MesocyclesTitles`}
              selected={isSelected}
              onClick={() => onSelectMesocycle(index)}
            >
              {each}
            </Toggle>
          );
        })}
      </ToggleLayout>

      <ToggleLayout label="Microcycle">
        {microcycle_array.map((each, index) => {
          const isSelected = selectedMicrocycle === index;
          return (
            <Toggle
              key={`${each}_${index}_MicrocyclesTitles`}
              selected={isSelected}
              onClick={() => onSelectMicrocycle(index)}
            >
              {each}
            </Toggle>
          );
        })}
      </ToggleLayout>
    </div>
  );
};
