import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";

const createTrainingBlockData = (
  training_block: NewTrainingWeek[][] | TrainingDayType[][]
) => {
  const lol = training_block.map((meso, index) => {
    return {
      mesocycle: index + 1,
      sessions: meso.map((session, i) => ({
        name: session.day,
        split: session.sessions.length ? session.sessions[0].split : "off",
      })),
    };
  });
};

const TBLOCK_TEST: NewTrainingWeek[][] | TrainingDayType[][] = [
  [
    {
      day: "Monday",
      isTrainingDay: true,
      sessions: [{ id: "0329", split: "upper", exercises: [] }],
    },
  ],
  [],
  [],
];
export default function SavedTrainingBlocks() {
  const { training_block } = useTrainingProgramContext();

  const training_blocks = [TBLOCK_TEST];
  console.log(training_block, "data here?");
  return (
    <div className="flex flex-col">
      <div>
        <h2>My Training Blocks</h2>
      </div>
      <div>
        <ul>
          {training_blocks.map((block, index) => {
            return <TrainingBlockItem index={index} training_block={block} />;
          })}
        </ul>
      </div>
    </div>
  );
}

type TrainingBlockItemProps = {
  index: number;
  training_block: NewTrainingWeek[][] | TrainingDayType[][];
};
function TrainingBlockItem({ index, training_block }: TrainingBlockItemProps) {
  return (
    <div className="flex ">
      <Collapsible>
        <CollapsibleTrigger>Training Block {index + 1}</CollapsibleTrigger>
        <CollapsibleContent>
          <Collapsible>
            {training_block.map((meso, index) => {
              return (
                <>
                  <CollapsibleTrigger>Mesocycle {index + 1}</CollapsibleTrigger>
                  <CollapsibleContent>
                    {meso.map((week, i) => {
                      const hasSession = week.sessions[0]
                        ? week.sessions[0].split
                        : false;
                      if (!hasSession) return null;
                      return <div>{week.sessions[0].split}</div>;
                    })}
                  </CollapsibleContent>
                </>
              );
            })}
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
