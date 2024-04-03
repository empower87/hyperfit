import { BG_COLOR_M5, BG_COLOR_M7 } from "~/constants/themes";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { SectionH2 as Section } from "../Layout/Sections";
import TrainingBlock from "../Macrocycle/TrainingBlock/TrainingBlock";
import TableOfContents from "../TableofContents/TableOfContents";
import ExerciseOverview from "./ExerciseSelection/ExerciseSelection";
import MuscleEditor from "./ExerciseSelection/components/ExerciseEditor/MuscleEditor";
import { Button } from "./MusclePriorityList/MusclePriorityList";
import ProgramConfig from "./ProgramConfig/ProgramConfig";
import SplitOverview from "./ProgramConfig/SplitOverview";
import { PrioritizeMuscles } from "./ProgramConfig/components/PrioritizeMuscles/PrioritizeMuscles";
import { useProgramConfigContext } from "./ProgramConfig/hooks/useProgramConfig";

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

function Buttons() {
  const { onSaveConfig } = useProgramConfigContext();
  const onResetConfig = () => {
    console.log("reset");
  };
  return (
    <div className={`flex justify-end space-x-1 rounded p-2 ${BG_COLOR_M7}`}>
      <Button
        onClick={onResetConfig}
        className={`flex rounded px-2 text-slate-700 ${BG_COLOR_M5}`}
      >
        Reset
      </Button>

      <Button
        onClick={() => onSaveConfig()}
        className={`flex rounded bg-rose-400 px-3 text-white`}
      >
        Save Changes
      </Button>
    </div>
  );
}
