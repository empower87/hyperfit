import { type NextPage } from "next";
import TrainingBlock from "~/components/Macrocycle/TrainingBlock";
import PrioritizeFocus from "~/components/PrioritizeFocus";
import PrioritySectionLayout from "~/components/PrioritySectionLayout";
import PromptCardLayout, {
  FrequencySelectPrompts,
} from "~/components/PromptCardLayout";
import TestingWeeklySplit from "~/components/WeeklySplit/TrainingWeek";
import useWeeklySessionSplit from "~/hooks/useWeeklySessionSplit/useWeeklySessionSplit";

const Home: NextPage = () => {
  const {
    split,
    training_block,
    total_sessions,
    prioritized_muscle_list,
    handleUpdateMuscleList,
    handleFrequencyChange,
  } = useWeeklySessionSplit();

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="fixed flex h-8 w-full items-center justify-center bg-slate-700 ">
        <h1 className="text-lg font-bold text-white">Hyperfit</h1>
      </div>

      <div className="flex h-full w-full pt-8">
        <div className="flex h-full w-1/4 flex-col border-r-2 border-slate-700">
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

        <div className="flex h-full w-3/4 items-center justify-center">
          <div
            className="flex h-full w-full flex-col overflow-y-scroll rounded border border-slate-700"
            style={{ height: "97%", width: "98%" }}
          >
            <div className="rounded-t-sm bg-slate-700">
              <h2 className="ml-1 p-1 text-white">Training Block</h2>
            </div>

            <TestingWeeklySplit
              split={split}
              list={prioritized_muscle_list}
              total_sessions={total_sessions}
            />

            <TrainingBlock trainingBlock={training_block} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
