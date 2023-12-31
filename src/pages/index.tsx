import { type NextPage } from "next";
import { useState } from "react";
import PageContent from "~/components/CustomizeTrainingSplit/CustomizeTrainingSplit";
import { BG_COLOR_M6, BG_COLOR_M7, BG_COLOR_M8 } from "~/constants/themes";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";

const Home: NextPage = () => {
  const [trainingBlock, setTrainingBlock] = useState<TrainingDayType[][]>([]);
  return (
    <div
      id="modal-body"
      className={BG_COLOR_M8 + " flex h-screen w-full flex-col"}
    >
      <div
        className={
          BG_COLOR_M7 + " fixed flex h-8 w-full items-center justify-center"
        }
      >
        <h1 className="text-lg font-bold text-white">Hyperfit</h1>
      </div>

      <div className="flex h-full w-full pt-8">
        <div className={BG_COLOR_M6 + " flex h-full w-1/5 flex-col"}>
          {/* <PromptCardLayout title="Frequency">
            <FrequencySelectPrompts onClick={handleFrequencyChange} />
          </PromptCardLayout>

          <PrioritySectionLayout>
            <PrioritizeFocus
              musclePriority={prioritized_muscle_list}
              updateMusclePriority={handleUpdateMuscleList}
            />
          </PrioritySectionLayout> */}
        </div>

        <div
          id="edit-modal"
          className="relative flex h-full w-4/5 items-center justify-center"
        >
          {/* <div
            className="flex h-full w-full flex-col overflow-y-scroll"
            style={{ height: "97%", width: "98%" }}
          >
            <Section title="Customize Training Split">
              <CustomizeTrainingSplit setTrainingBlock={setTrainingBlock} />
            </Section>

            <Section title="Training Block">
              <TrainingBlock training_block={trainingBlock} />
            </Section>
          </div> */}
          <PageContent />
        </div>
      </div>
    </div>
  );
};

export default Home;
