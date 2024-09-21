import { type NextPage } from "next";
import Configuration from "~/components/Configuration";
import MuscleEditor from "~/components/CustomizeMuscleProgression/MuscleEditor";
import { SectionH2 as Section } from "~/components/Layout/Sections";
import TableOfContents from "~/components/TableofContents/TableOfContents";
import TrainingBlockOverview from "~/components/TrainingBlockOverview";
import TrainingWeekOverview from "~/components/TrainingWeekOverview/TrainingWeekOverview";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";

const Home: NextPage = () => {
  return (
    <div id="modal-body" className={"flex h-full bg-primary-800"}>
      <div
        className={
          "fixed z-10 flex h-10 w-full items-center justify-center bg-primary-700"
        }
      >
        <h1 className=" text-lg font-bold text-rose-400">Hyperfit</h1>
      </div>

      <TrainingProgramProvider>
        <div className={`mx-auto flex h-max max-w-[1200px] px-3 py-10`}>
          <TableOfContents />

          <div className="w-[90%]">
            <Section title="CONFIGURATION">
              <Configuration>
                <Configuration.MusclePrioritization />

                <Configuration.Layout>
                  <Configuration.Periodization />

                  <Configuration.Split>
                    <Configuration.SplitSelect />
                    <Configuration.SplitWeek />
                  </Configuration.Split>

                  <Configuration.Actions />
                </Configuration.Layout>
              </Configuration>
            </Section>

            <Section title="CUSTOMIZE MUSCLE PROGRESSION">
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
