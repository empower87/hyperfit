import { type NextPage } from "next";
import Configuration from "~/components/Configuration";
import SplitOverview from "~/components/Configuration/components/Split/SplitOverview";
import MuscleEditor from "~/components/CustomizeMuscleProgression/MuscleEditor";
import { SectionH2 as Section } from "~/components/Layout/Sections";
import TableOfContents from "~/components/TableofContents/TableOfContents";
import TrainingBlockOverview from "~/components/TrainingBlockOverview";
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
        <h1 className=" text-lg font-bold text-rose-400">Hyperfit</h1>
      </div>

      <TrainingProgramProvider>
        <div className={`mx-auto flex h-max max-w-[1200px] px-3 py-10`}>
          <TableOfContents />

          <div className="w-5/6">
            <Section title="CONFIGURATION">
              <Configuration>
                <Configuration.MusclePrioritization />

                <Configuration.Layout>
                  <Configuration.Periodization />

                  <Configuration.Split>
                    <SplitOverview.SplitSelect />
                    <SplitOverview.SplitWeek />
                  </Configuration.Split>

                  <Configuration.Actions />
                </Configuration.Layout>
              </Configuration>
            </Section>

            <Section title="CUSTOMIZE MUSCLE">
              <MuscleEditor />
            </Section>

            <Section title="TRAINING WEEK OVERVIEW">
              <TrainingWeekOverview />
            </Section>

            <Section title="TRAINING BLOCK OVERVIEW">
              <TrainingBlockOverview />
            </Section>
          </div>
        </div>
      </TrainingProgramProvider>
    </div>
  );
};

export default Home;
