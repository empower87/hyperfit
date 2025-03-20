import { memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { ToggleCyclesProvider } from "../MesocycleToggle/hooks/useMesocycleToggle";
import { ToggleCycles } from "../MesocycleToggle/MesocycleToggle";
import EditMuscleProgressionWithProvider from "./EditMuscleProgression/EditMuscleProgression";
import TrainingBlock from "./TrainingBlockOverview";
import TrainingWeekOverview from "./TrainingWeekOverview/TrainingWeekOverviewDnD";

const TABS = [
  "training-week-overview",
  "edit-muscle",
  "training-block-overview",
] as const;
type TabKey = (typeof TABS)[number];

export const CustomizationPage = () => {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles, microcycles } = training_program_params;

  return (
    <ToggleCyclesProvider mesocycles={mesocycles} microcycles={microcycles}>
      <div className="flex h-full flex-col space-y-3 overflow-y-scroll pb-14 pr-1 pt-8">
        <ToggleCycles>
          <ToggleCycles.Mesocycles />
          <ToggleCycles.Microcycles />
        </ToggleCycles>

        <div className="flex flex-col rounded-lg">
          <CustomizationTabs />
        </div>
      </div>
    </ToggleCyclesProvider>
  );
};

export const CustomizationTabs = memo(() => {
  const getPresentationalTab = (tab: string) => {
    const presentationalTab = tab
      .split("-")
      .map((tab) => tab.charAt(0).toUpperCase() + tab.slice(1))
      .join(" ");
    return presentationalTab;
  };

  return (
    <Tabs defaultValue={TABS[0]} className="w-full">
      <TabsList className="flex items-end justify-start rounded-none border-b border-primary-600 bg-background p-0">
        {TABS.map((tab, index) => {
          const presentationalTab = getPresentationalTab(tab);
          return (
            <TabsTrigger
              key={`TabsTrigger_${tab}_${index}`}
              className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-white"
              value={tab}
            >
              {presentationalTab}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {TABS.map((tab, index) => {
        return (
          <TabsContent key={`TabsContent_${tab}_${index}`} value={tab}>
            <SelectedTabContent selectedTab={tab} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
});

type SelectedTabContentProps = {
  selectedTab: TabKey;
};
const SelectedTabContent = ({ selectedTab }: SelectedTabContentProps) => {
  switch (selectedTab) {
    case "training-week-overview":
      return <TrainingWeekOverview />;
    case "edit-muscle":
      return <EditMuscleProgressionWithProvider />;
    case "training-block-overview":
      return <TrainingBlock />;
    default:
      return <></>;
  }
};
