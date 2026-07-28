import { HTMLAttributes, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/utils";
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

interface CustomizationPageProps extends HTMLAttributes<HTMLDivElement> {}
export const CustomizationPage = ({
  className,
  ...props
}: CustomizationPageProps) => {
  const { training_program_params } = useTrainingProgramContext();
  const { mesocycles, microcycles } = training_program_params;

  return (
    <ToggleCyclesProvider mesocycles={mesocycles} microcycles={microcycles}>
      <div
        {...props}
        className={cn(
          "flex h-full flex-col space-y-3 px-4 pb-14 pt-8",
          className
        )}
      >
        <div className="flex flex-col rounded-lg">
          <CustomizationTabs>
            <ToggleCycles>
              <ToggleCycles.Mesocycles />
              <ToggleCycles.Microcycles />
            </ToggleCycles>
          </CustomizationTabs>
        </div>
      </div>
    </ToggleCyclesProvider>
  );
};

type CustomizationTabsProps = {
  children: React.ReactNode;
};
export const CustomizationTabs = memo(
  ({ children }: CustomizationTabsProps) => {
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

        {children}

        {TABS.map((tab, index) => {
          return (
            <TabsContent key={`TabsContent_${tab}_${index}`} value={tab}>
              <SelectedTabContent selectedTab={tab} />
            </TabsContent>
          );
        })}
      </Tabs>
    );
  }
);

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
