import { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { ToggleCyclesProvider } from "../MesocycleToggle/hooks/useMesocycleToggle";
import EditMuscleProgressionWithProvider from "./EditMuscleProgression/EditMuscleProgression";
import TrainingBlock from "./TrainingBlockOverview";
import TrainingWeekOverview from "./TrainingWeekOverview/TrainingWeekOverviewDnD";
import { ToggleCycles } from "./TrainingWeekOverview/components/MesocycleToggle";

const TABS = [
  "training-week-overview",
  "edit-muscle",
  "training-block-overview",
] as const;
type TabKey = (typeof TABS)[number];

export const CustomizationTabs = memo(() => {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles, microcycles } = training_program_params;

  return (
    <ToggleCyclesProvider mesocycles={mesocycles} microcycles={microcycles}>
      <Tabs defaultValue={TABS[0]} className="w-full">
        <TabsList className="flex items-end justify-start rounded-none border-b border-primary-600 bg-background pb-0">
          {TABS.map((tab, index) => {
            const presentationalTab = getPresentationalTab(tab);
            return (
              <TabsTrigger
                className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-white"
                value={tab}
              >
                {presentationalTab}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <ToggleCycles />

        {TABS.map((tab, index) => {
          const tabContent = getSelectedTabContent(tab);
          return <TabsContent value={tab}>{tabContent}</TabsContent>;
        })}
      </Tabs>
    </ToggleCyclesProvider>
  );
});

const getPresentationalTab = (tab: string) => {
  const presentationalTab = tab
    .split("-")
    .map((tab) => tab.charAt(0).toUpperCase() + tab.slice(1))
    .join(" ");
  return presentationalTab;
};

const getSelectedTabContent = (selectedTab: TabKey) => {
  switch (selectedTab) {
    case "training-week-overview":
      return <TrainingWeekOverview />;
    case "edit-muscle":
      return <EditMuscleProgressionWithProvider />;
    case "training-block-overview":
      return <TrainingBlock />;
    default:
      return;
  }
};
