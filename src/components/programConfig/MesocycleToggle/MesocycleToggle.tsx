import { HTMLAttributes, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/clsx";
import { useToggleCyclesContext } from "./hooks/useMesocycleToggle";

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
    <div className={`flex justify-center space-x-2`}>
      <div
        className={`flex items-center justify-center rounded-l bg-primary-700 px-2 py-1 text-sm text-white`}
      >
        {label}
      </div>

      <div className={`flex space-x-2`}>{children}</div>
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

export function MesocycleToggle({
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

type ToggleButtonProps = {
  isToggled: boolean;
  onClick: () => void;
  children: ReactNode;
};

const ToggleButton = ({ isToggled, onClick, children }: ToggleButtonProps) => {
  const isToggledClasses =
    "scale-105 border-secondary-300 bg-card text-secondary-300";
  const classes = isToggled ? isToggledClasses : "";
  return (
    <Button
      size="iconLg"
      variant="outline"
      className={`${classes}`}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Microcycles = () => {
  const { microcycles, selectedMicrocycle, onSelectMicrocycle } =
    useToggleCyclesContext();

  return (
    <ToggleLayout label="Microcycles">
      {microcycles?.map((each, index) => {
        const isSelected = selectedMicrocycle === index;
        return (
          <ToggleButton
            key={`${each}_${index}_MicrocyclesTitles`}
            isToggled={isSelected}
            onClick={() => onSelectMicrocycle(index)}
          >
            {index + 1}
          </ToggleButton>
        );
      })}
    </ToggleLayout>
  );
};

const Mesocycles = () => {
  const { mesocycles, selectedMesocycle, onSelectMesocycle } =
    useToggleCyclesContext();

  return (
    <ToggleLayout label="Mesocycles">
      {mesocycles?.map((each, index) => {
        const isSelected = selectedMesocycle === index;
        return (
          <ToggleButton
            key={`${each}_${index}_MesocyclesTitles`}
            isToggled={isSelected}
            onClick={() => onSelectMesocycle(index)}
          >
            {index + 1}
          </ToggleButton>
        );
      })}
    </ToggleLayout>
  );
};

export const ToggleCycles = ({ children }: { children: ReactNode }) => {
  return (
    <div className={`flex w-full items-center space-x-8 rounded py-4`}>
      {children}
    </div>
  );
};
ToggleCycles.Microcycles = Microcycles;
ToggleCycles.Mesocycles = Mesocycles;
