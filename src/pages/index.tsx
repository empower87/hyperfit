import { type NextPage } from "next";
import Configuration from "~/components/Configuration";
import Buttons from "~/components/Configuration/components/Buttons";
import { PrioritizeMuscles } from "~/components/Configuration/components/PrioritizeMuscles/PrioritizeMuscles";
import SplitOverview from "~/components/Configuration/components/Split/SplitOverview";
import MuscleEditor from "~/components/CustomizeMuscleProgression/MuscleEditor";
import { SectionH2 as Section } from "~/components/Layout/Sections";
import TableOfContents from "~/components/TableofContents/TableOfContents";
import TrainingBlock from "~/components/TrainingBlockOverview/TrainingBlock/TrainingBlock";
import TrainingWeekOverview from "~/components/TrainingWeekOverview/TrainingWeekOverview";
import { BG_COLOR_M7, BG_COLOR_M8 } from "~/constants/themes";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";

const Home: NextPage = () => {
  return (
    <div id="modal-body" className={BG_COLOR_M8 + " flex h-full"}>
      <div
        className={
          BG_COLOR_M7 +
          " fixed z-10 flex h-10 w-full items-center justify-center"
        }
      >
        <h1 className=" text-lg font-bold text-white">Hyperfit</h1>
      </div>

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
    </div>
  );
};

export default Home;
