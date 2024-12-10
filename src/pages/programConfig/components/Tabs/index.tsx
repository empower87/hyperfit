import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import EditMuscleProgressionWithProvider from "./EditMuscleProgression/EditMuscleProgression";
import TrainingBlock from "./TrainingBlockOverview";
import TrainingWeekOverview from "./TrainingWeekOverview/TrainingWeekOverview";

const TABS = [
  "training-week-overview",
  "edit-muscle",
  "training-block-overview",
] as const;
type TabKey = (typeof TABS)[number];

export default function CustomizationTabs() {
  const getSelectedTabContent = (selectedTab: TabKey) => {
    switch (selectedTab) {
      case "training-week-overview":
        return <TrainingWeekOverview />;
      case "edit-muscle":
        return <EditMuscleProgressionWithProvider />;
      case "training-block-overview":
        // NOTE: takes a few seconds to load and causes tab to pause.
        return <TrainingBlock />;
      default:
        return;
    }
  };

  return (
    <Tabs defaultValue={TABS[0]} className="w-full">
      <TabsList className="flex items-end justify-start rounded-none border-b border-primary-600 bg-background pb-0">
        {TABS.map((tab, index) => {
          const presentationalTab = tab
            .split("-")
            .map((tab) => tab.charAt(0).toUpperCase() + tab.slice(1))
            .join(" ");
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
      {TABS.map((tab, index) => {
        const tabContent = getSelectedTabContent(tab);
        return <TabsContent value={tab}>{tabContent}</TabsContent>;
      })}
    </Tabs>
  );
}
