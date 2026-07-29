import { PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { ProgramConfigOptionCard } from "~/pages/programConfig";
import FrequencySelection from "../FrequencySelection";
import SplitSelect from "../SplitSelect";
import VolumeSelect from "../VolumeSelect";

const Item = ({ value }: { value: number }) => {
  return (
    <ToggleGroupItem
      value={value.toString()}
      className="h-8 w-8 p-0"
      size="lg"
      variant="outline"
    >
      {value}
    </ToggleGroupItem>
  );
};

type ToggleMesocycleGroupProps = {
  mesocycles: number;
};
const ToggleMesocycleGroup = ({ mesocycles }: ToggleMesocycleGroupProps) => {
  const mesocyclesArray = Array.from({ length: mesocycles }, (_, i) => i + 1);

  return (
    <ToggleGroup type="single" className="justify-start">
      {mesocyclesArray.map((num) => (
        <Item key={num} value={num} />
      ))}
    </ToggleGroup>
  );
};

type ToggleMesocycleProps = {
  mesocycles: number;
};

export default function ToggleMesocycle({ mesocycles }: ToggleMesocycleProps) {
  return (
    <div>
      <h3 className="text-primary-00 p-2 text-sm font-semibold">Mesocycles</h3>
      <div className="flex space-x-1 p-3 pt-0">
        <ToggleMesocycleGroup mesocycles={mesocycles} />
        <Button size="iconLg">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

type MesocyclePanelProps = {
  selected_mesocycle: number;
  selected_mesocycle_name?: string;
};
export const MesocyclePanel = ({
  selected_mesocycle,
  selected_mesocycle_name,
}: MesocyclePanelProps) => {
  return (
    <div>
      <h3 className="p-2 text-sm font-semibold text-primary-300">
        Mesocycle {selected_mesocycle}
      </h3>
      <div className="p-3">
        {selected_mesocycle_name && (
          <p className="text-primary-00 text-sm">{selected_mesocycle_name}</p>
        )}
      </div>
      <div className="flex flex-col p-3">
        <ProgramConfigOptionCard title="1. Frequency">
          <FrequencySelection />
        </ProgramConfigOptionCard>

        <ProgramConfigOptionCard title="2. Split">
          <SplitSelect />
        </ProgramConfigOptionCard>

        <ProgramConfigOptionCard title="3. Volume">
          <VolumeSelect />
        </ProgramConfigOptionCard>
      </div>
    </div>
  );
};
