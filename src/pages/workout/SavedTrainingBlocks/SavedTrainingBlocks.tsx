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

export default function SavedTrainingBlocks() {
  const { training_block } = useTrainingProgramContext();

  return (
    <div className="flex flex-col">
      <div>
        <h2>My Training Blocks</h2>
      </div>
      <div></div>
    </div>
  );
}
