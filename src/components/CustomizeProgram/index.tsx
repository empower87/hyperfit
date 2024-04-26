import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Configuration from "../Configuration";
import Buttons from "../Configuration/components/Buttons";
import { PrioritizeMuscles } from "../Configuration/components/PrioritizeMuscles/PrioritizeMuscles";
import SplitOverview from "../Configuration/components/Split/SplitOverview";
import MuscleEditor from "../CustomizeMuscleProgression/MuscleEditor";
import { SectionH2 as Section } from "../Layout/Sections";
import TableOfContents from "../TableofContents/TableOfContents";
import TrainingBlock from "../TrainingBlockOverview/TrainingBlock/TrainingBlock";
import TrainingWeekOverview from "../TrainingWeekOverview/TrainingWeekOverview";

export default function PageContent() {
  return (
    <TrainingProgramProvider>
      <div className={`mx-auto flex h-max max-w-[1200px] px-3 py-10`}>
        <TableOfContents />

        <div className="w-5/6">
          <Section title="CONFIGURATION">
            <Configuration>
              <PrioritizeMuscles />
              <div className={`flex flex-col space-y-1`}>
                <Configuration.Periodization />

                <SplitOverview>
                  <SplitOverview.Split />
                  <SplitOverview.Week />
                </SplitOverview>

                <Buttons />
              </div>
            </Configuration>
          </Section>

          <Section title="CUSTOMIZE MUSCLE">
            <MuscleEditor />
          </Section>

          <Section title="TRAINING WEEK OVERVIEW">
            <TrainingWeekOverview />
          </Section>

          <Section title="TRAINING BLOCK OVERVIEW">
            <TrainingBlock />
          </Section>
        </div>
      </div>
    </TrainingProgramProvider>
  );
}
