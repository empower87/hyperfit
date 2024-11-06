import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import Counter from "../EditorPopout/Counter";

type ToggleMesocycleProps = {};
export default function ToggleMesocycle({}: ToggleMesocycleProps) {
  const {
    frequencyProgression,
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
  } = useMuscleEditorContext();
  return (
    <div className="grid grid-cols-4 grid-rows-3 gap-x-3 gap-y-1">
      <div className="">Mesocycle</div>
      <div className="flex items-center justify-center">1</div>
      <div className="flex items-center justify-center">2</div>
      <div className="flex items-center justify-center">3</div>

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
      <div className="flex items-center justify-center">20</div>
      <div className="flex items-center justify-center">22</div>
      <div className="flex items-center justify-center">24</div>
    </div>
  );
}
