import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/clsx";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import Counter from "../EditorPopout/Counter";

type ToggleMesocycleProps = {};
export default function ToggleMesocycle({}: ToggleMesocycleProps) {
  const {
    selectedMesocycleIndex,
    onSelectMesocycle,
    mesocyclesArray,
    frequencyProgression,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
    volumes,
  } = useMuscleEditorContext();

  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-x-3 gap-y-1">
      <div className="">Mesocycle</div>

      {mesocyclesArray.map((meso, index) => {
        const isSelectedIndex = index === selectedMesocycleIndex;
        return (
          <MesocycleTab
            mesocycleIndex={index + 1}
            isSelectedIndex={isSelectedIndex}
            onClick={() => onSelectMesocycle(index)}
          />
        );
      })}

      <div className="mt-1 text-sm text-muted-foreground">Frequency</div>

      {frequencyProgression.map((frequency, index) => {
        const frequencyString = frequency.toString();
        return (
          <div className="mt-1">
            <Counter
              minus={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSelectedFrequencyProgressionDecrement(index)}
                >
                  <MinusIcon fill="white" />
                </Button>
              }
              input={<Input placeholder={frequencyString} />}
              plus={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onSelectedFrequencyProgressionIncrement(index)}
                >
                  <PlusIcon fill="white" />
                </Button>
              }
            />
          </div>
        );
      })}

      <div className="text-sm text-muted-foreground">Volume</div>
      {volumes.map((volume, index) => {
        return <div className="flex items-center justify-center">{volume}</div>;
      })}
    </div>
  );
}

interface MesocycleTabProps extends React.HTMLAttributes<HTMLButtonElement> {
  mesocycleIndex: number;
  isSelectedIndex: boolean;
}
function MesocycleTab({
  mesocycleIndex,
  isSelectedIndex,
  ...props
}: MesocycleTabProps) {
  return (
    <button
      {...props}
      className={cn(`flex items-center justify-center rounded-md`, {
        ["bg-card"]: isSelectedIndex,
      })}
      disabled={isSelectedIndex}
    >
      {mesocycleIndex}
    </button>
  );
}
