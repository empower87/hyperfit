import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import Counter from "./Counter";

type EditFrequencyProps = {
  frequency_progression: number[];
};
export function EditFrequency({ frequency_progression }: EditFrequencyProps) {
  return (
    <div className="flex">
      {frequency_progression.map((frequency, index) => {
        return <FrequencyCounter index={index + 1} frequency={frequency} />;
      })}
    </div>
  );
}

type FrequencyCounterProps = {
  index: number;
  frequency: number;
};
function FrequencyCounter({ index, frequency }: FrequencyCounterProps) {
  const {
    onSelectedFrequencyProgressionIncrement,
    onSelectedFrequencyProgressionDecrement,
  } = useMuscleEditorContext();
  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-1.5 px-2 pt-2 text-sm font-semibold text-primary-400">
        <h2 className="font-semibold leading-none tracking-tight">
          Mesocycle {index}
        </h2>
      </div>

      <div className="p-2">
        <Counter>
          <Counter.Button
            variant="md"
            onClick={() => onSelectedFrequencyProgressionDecrement(index)}
          >
            <MinusIcon fill="white" />
          </Counter.Button>

          <Counter.Input variant="md" value={frequency} />

          <Counter.Button
            variant="md"
            onClick={() => onSelectedFrequencyProgressionIncrement(index)}
          >
            <PlusIcon fill="white" />
          </Counter.Button>
        </Counter>
      </div>
    </div>
  );
}
