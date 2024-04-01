import { BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { cn } from "~/lib/clsx";

type TitleProps = {
  title: string;
  selected: string;
  variant: "primary" | "secondary";
  onClick: (title: string) => void;
};
function Title({ title, selected, variant, onClick }: TitleProps) {
  const isSelected = title === selected;
  const text = isSelected ? "text-sm text-white" : "text-xxs text-slate-400";
  const textSize = variant === "secondary" ? "text-xxs" : "text-sm";
  const padding = variant === "secondary" ? "px-0.5 py-1" : "px-1 py-2";

  return (
    <div
      className={cn(
        `cursor-pointer ${padding} ${BG_COLOR_M7} hover:${BG_COLOR_M6}`,
        {
          [`${BG_COLOR_M6} text-m mb-1 text-white`]: isSelected,
          [`${BG_COLOR_M7} text-m text-slate-400`]: !isSelected,
        }
      )}
      onClick={() => onClick(title)}
    >
      <p className={cn(`indent-1 ${textSize}`)}>{title}</p>
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
    <div className={`mb-3 flex w-full flex-col items-center justify-center`}>
      <div className={`flex w-full justify-center p-1 ${BG_COLOR_M6}`}>
        <div className={`flex space-x-2`}>
          {mesocycles.map((each, index) => {
            return (
              <Title
                key={`${each}_${index}_MesocyclesTitles`}
                title={each}
                selected={selectedMesocycle}
                variant="primary"
                onClick={() => onClickHandler(each)}
              />
            );
          })}
        </div>
      </div>

      <div className={`flex space-x-1 p-1`}>
        {microcycles.map((each, index) => {
          return (
            <Title
              key={`${each}_${index}_MicrocyclesTitles`}
              title={each}
              selected={selectedMicrocycle}
              variant="secondary"
              onClick={() => onClickHandler(each)}
            />
          );
        })}
      </div>
    </div>
  );
}
