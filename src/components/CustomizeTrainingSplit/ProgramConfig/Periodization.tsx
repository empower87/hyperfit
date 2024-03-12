import { CardS as Card } from "~/components/Layout/Sections";
import { Select, SelectLabel } from "~/components/Layout/Select";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

const MACROCYCLES = [];
const MESOCYCLES = [1, 2, 3, 4];
const MICROCYCLES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TRAINING_BLOCKS = [1, 2, 3, 4];

export default function Periodization() {
  const { training_program_params } = useTrainingProgramContext();
  const { macrocycles, mesocycles, microcycles, blocks } =
    training_program_params;

  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };
  return (
    <Card title="Periodization">
      <SelectLabel label="Training Blocks (1-4 mesocycles) ">
        <Select
          selectedOption={blocks}
          options={TRAINING_BLOCKS}
          onSelect={onSelectHandler}
        />
      </SelectLabel>

      <SelectLabel label="Mesocycles (3-12 microcycles) ">
        <Select
          selectedOption={mesocycles}
          options={MESOCYCLES}
          onSelect={onSelectHandler}
        />
      </SelectLabel>

      <SelectLabel label="Microcycles (~ 1 week)">
        <Select
          selectedOption={microcycles}
          options={MICROCYCLES}
          onSelect={onSelectHandler}
        />
      </SelectLabel>
    </Card>
  );
}
