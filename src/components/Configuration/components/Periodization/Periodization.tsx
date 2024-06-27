import { CardS as Card } from "~/components/Layout/Sections";
import { Select, SelectLabel } from "~/components/Layout/Select";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { getRankColor } from "~/utils/getIndicatorColors";
import Frequency from "./Frequency";

const MACROCYCLES = [];
const MESOCYCLES = [1, 2, 3, 4];
const MICROCYCLES = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TRAINING_BLOCKS = [1, 2, 3, 4];

export default function Periodization() {
  return (
    <Card title="PERIODIZATION" className={"h-full"}>
      <div className="flex flex-col">
        <div className={`flex space-x-1`}>
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
      className={`m-0.5 flex space-x-1 p-0.5 text-xxs text-white ${
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
  // const { priorityListTest, sessionsTest, avgFrequencies, testSessions } =
  //   useProgramConfigContext();
  return (
    <div className={`flex space-x-1`}>
      {/* <ul>
            {priorityListTest.map((each, index) => {
              return <MuscleItem muscle={each} />;
            })}
          </ul> */}

      <div className="flex flex-col">
        <div className="flex">
          {/* <ul className={`flex flex-col text-xs text-white`}>
            {sessionsTest.map((each) => {
              return (
                <li className="flex space-x-1">
                  <div className={`flex w-10`}>{each.session}</div>
                  {each.modifiers.map((ea, index) => {
                    const text =
                      (index === 0 || index === each.modifiers.length - 1) &&
                      ea > 0
                        ? "text-red-500 font-semi-bold"
                        : "text-white";
                    return (
                      <div
                        className={`flex w-7 items-center justify-center ${text}`}
                      >
                        {ea > 0 ? ea : "-"}
                      </div>
                    );
                  })}
                </li>
              );
            })}
          </ul> */}

          <ul className={`flex flex-col text-xs text-white`}>
            {/* <li className={`flex space-x-1`}>
              <div className={`w-10`}>push</div>
              <div className={`w-6`}>{avgFrequencies.push[0]}</div>
              <div className={`w-6`}>{avgFrequencies.push[1]}</div>
              <div className={`w-6 text-blue-400`}>
                {(avgFrequencies.push[0] + avgFrequencies.push[1]) / 2}
              </div>
            </li>
            <li className={`flex space-x-1`}>
              <div className={`w-10`}>pull</div>
              <div className={`w-6`}>{avgFrequencies.pull[0]}</div>
              <div className={`w-6`}>{avgFrequencies.pull[1]}</div>
              <div className={`w-6 text-blue-400`}>
                {(avgFrequencies.pull[0] + avgFrequencies.pull[1]) / 2}
              </div>
            </li>

            <li className={`flex space-x-1`}>
              <div className={`w-10`}>upper</div>
              <div className={`w-6`}>
                {avgFrequencies.pull[0] + avgFrequencies.push[0]}
              </div>
              <div className={`w-6`}>
                {avgFrequencies.pull[1] + avgFrequencies.push[1]}
              </div>
              <div className={`w-6 text-red-500`}>
                {(avgFrequencies.pull[0] +
                  avgFrequencies.pull[1] +
                  avgFrequencies.push[0] +
                  avgFrequencies.push[1]) /
                  4}
              </div>
            </li>
            <li className={`flex space-x-1`}>
              <div className={`w-10`}>legs</div>
              <div className={`w-6`}>{avgFrequencies.legs[0]}</div>
              <div className={`w-6`}>{avgFrequencies.legs[1]}</div>
              <div className={`w-6 text-red-500`}>
                {(avgFrequencies.legs[0] + avgFrequencies.legs[1]) / 2}
              </div>
            </li> */}
          </ul>
        </div>

        {/* 
        <ul className={"space-y-0.5"}>
          {Object.entries(testSessions).map(([key, val]) => {
            const range = avgFrequencies[key as keyof typeof avgFrequencies]
              ? avgFrequencies[key as keyof typeof avgFrequencies]
              : [0, 0];
            return (
              <TestItem
                key={`${key}_TESTITEM_${val}`}
                title={key}
                data={val}
                range={range}
              />
            );
          })}
        </ul> */}
      </div>
    </div>
  );
}

const TestItem = ({
  title,
  data,
  range,
}: {
  title: string;
  data: number;
  range: number[];
}) => {
  return (
    <li className={`flex space-x-1 text-xs text-white`}>
      <div className={`w-16 rounded bg-red-500 px-1 py-0.5 font-semibold`}>
        {title}
      </div>
      <div className={`w-12`}>
        {range[0]} - {range[1]}
      </div>
      <div>{data}</div>
    </li>
  );
};
