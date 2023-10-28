import { type NextPage } from "next";
import CustomizeTrainingSplit from "~/components/CustomizeTrainingSplit/CustomizeTrainingSplit";
import Section from "~/components/Layout/Section";
import TrainingBlock from "~/components/Macrocycle/TrainingBlock/TrainingBlock";
import PrioritizeFocus from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelectPrompts,
} from "~/components/PromptCardLayout";
import useWeeklySessionSplit from "~/hooks/useWeeklySessionSplit/useWeeklySessionSplit";

import { BG_COLOR_M6, BG_COLOR_M7, BG_COLOR_M8 } from "~/utils/themes";

const Home: NextPage = () => {
  const {
    split,
    total_sessions,
    prioritized_muscle_list,
    handleUpdateMuscleList,
    handleFrequencyChange,
  } = useWeeklySessionSplit();

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
          <PromptCardLayout title="Frequency">
            <FrequencySelectPrompts onClick={handleFrequencyChange} />
          </PromptCardLayout>

          <PrioritySectionLayout>
            <PrioritizeFocus
              musclePriority={prioritized_muscle_list}
              updateMusclePriority={handleUpdateMuscleList}
            />
          </PrioritySectionLayout>
        </div>

        <div
          id="edit-modal"
          className="relative flex h-full w-4/5 items-center justify-center"
        >
          <div
            className="flex h-full w-full flex-col overflow-y-scroll"
            style={{ height: "97%", width: "98%" }}
          >
            <Section title="Customize Training Split">
              <CustomizeTrainingSplit
                prioritized_muscle_list={prioritized_muscle_list}
                total_sessions={total_sessions}
                split={split}
              />
            </Section>

            <Section title="Training Block">
              <TrainingBlock split={split} />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
