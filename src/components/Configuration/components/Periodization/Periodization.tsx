import { CardS as Card } from "~/components/Layout/Sections";
import { Select, SelectLabel } from "~/components/Layout/Select";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { getRankColor } from "~/utils/getIndicatorColors";
import { useProgramConfigContext } from "../../hooks/useProgramConfig";
import Frequency from "./Frequency";

const MACROCYCLES = [];
const MESOCYCLES = [1, 2, 3, 4];
const MICROCYCLES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TRAINING_BLOCKS = [1, 2, 3, 4];

export default function Periodization() {
  return (
    <Card title="PERIODIZATION" className={"h-full"}>
      <div className="flex">
        <div className={`flex flex-col space-x-1`}>
          <Frequency />
          <OtherParams />
        </div>

        <PriorityRankingTest />
      </div>
    </Card>
  );
}

const OtherParams = () => {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles, microcycles, blocks } = training_program_params;

  const onSelectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
  };
  return (
    <div className={`p-1`}>
      <div className={`pb-1 text-xs text-white`}>Macrocycle</div>

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
    </div>
  );
};

function MuscleItem({
  muscle,
}: {
  muscle: { muscle: MusclePriorityType; index: number; modifiers: number[] };
}) {
  return (
    <li
      className={`flex space-x-1 text-xxs text-white ${
        getRankColor(muscle.muscle.volume.landmark).bg
      }`}
    >
      <div className={`w-4`}>{muscle.index}</div>
      <div className={`w-12`}>{muscle.muscle.muscle}</div>
      {muscle.modifiers.map((each) => {
        return <div className={`flex w-6 justify-start indent-1`}>{each}</div>;
      })}
    </li>
  );
}
function PriorityRankingTest() {
  const { priorityListTest, sessionsTest } = useProgramConfigContext();
  return (
    <div className={`flex space-x-1`}>
      <ul>
        {priorityListTest.map((each, index) => {
          return <MuscleItem muscle={each} />;
        })}
      </ul>

      <ul className={`flex flex-col text-xs text-white`}>
        {sessionsTest.map((each) => {
          return (
            <li className="flex space-x-1">
              <div className={`flex w-10`}>{each.session}</div>
              {each.modifiers.map((each) => {
                return (
                  <div className={`flex w-6 items-center justify-center`}>
                    {each}
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
