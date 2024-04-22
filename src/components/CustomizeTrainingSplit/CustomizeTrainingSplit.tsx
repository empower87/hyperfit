import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { SectionH2 as Section } from "../Layout/Sections";
import TrainingBlock from "../Macrocycle/TrainingBlock/TrainingBlock";
import TableOfContents from "../TableofContents/TableOfContents";
import ExerciseOverview from "./ExerciseSelection/ExerciseSelection";
import MuscleEditor from "./ExerciseSelection/components/ExerciseEditor/MuscleEditor";
import ProgramConfig from "./ProgramConfig/ProgramConfig";
import SplitOverview from "./ProgramConfig/SplitOverview";
import Buttons from "./ProgramConfig/components/Buttons";
import { PrioritizeMuscles } from "./ProgramConfig/components/PrioritizeMuscles/PrioritizeMuscles";

export default function PageContent() {
  return (
    <TrainingProgramProvider>
      <div className={`mx-auto flex h-max max-w-[1200px] px-3 py-10`}>
        <TableOfContents />

        <div className="w-5/6">
          <Section title="CONFIGURATION">
            <ProgramConfig>
              <PrioritizeMuscles />
              <div className={`flex flex-col space-y-1`}>
                <ProgramConfig.Periodization />

                <SplitOverview>
                  <SplitOverview.Split />
                  <SplitOverview.Week />
                </SplitOverview>

                <Buttons />
              </div>
            </ProgramConfig>

            <div className="mb-2 flex flex-col">
              <MuscleEditor />
            </div>

            <ExerciseOverview />
          </Section>

          <Section title="TRAINING BLOCK OVERVIEW">
            <TrainingBlock />
          </Section>
        </div>
      </div>
    </TrainingProgramProvider>
  );
}
