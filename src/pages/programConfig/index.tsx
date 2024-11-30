import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

import { Split, TrainingWeek } from "./components/Split/SplitOverview";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Actions from "./components/Actions";
import { EditMuscleProgressionWithProvider } from "./components/CustomizeMuscleProgression/EditMuscleProgression";
import MusclePrioritizationList from "./components/MusclePrioritization";
import TrainingWeekOverview from "./components/TrainingWeekOverview/TrainingWeekOverview";
import {
  ProgramConfigProvider,
  useProgramConfigContext,
} from "./hooks/useProgramConfig";

const TABS = ["training-week-overview", "edit-muscle"] as const;
type TabKey = (typeof TABS)[number];

export default function ProgramConfig() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [selectedMuscleId, setSelectedMuscleId] =
    useState<MusclePriorityType["id"]>("");
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabKey>(
    "training-week-overview"
  );
  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  const onSelectTab = (tab: TabKey) => setSelectedTab(tab);

  const onMuscleClick = (id: MusclePriorityType["id"]) => {
    setSelectedMuscleId(id);
  };

  const selectedMuscle = prioritized_muscle_list.filter(
    (muscle) => muscle.id === selectedMuscleId
  )[0];

  const SelectedTab = useCallback(() => {
    switch (selectedTab) {
      case "training-week-overview":
        return <TrainingWeekOverview />;
      case "edit-muscle":
        return (
          <EditMuscleProgressionWithProvider selectedMuscle={selectedMuscle} />
        );
      default:
        return;
    }
  }, [selectedTab, selectedMuscle]);

  return (
    <ProgramConfigProvider>
      <div className="flex h-full flex-col pt-10">
        <h1 className="mb-5 text-white">Program Configuration</h1>
        <div className="flex h-full space-x-5">
          <div className="h-full">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between space-x-2 border-b border-primary-500 pb-2 ">
                  <CardTitle>1. Priority</CardTitle>
                  {isPriorityListCollapsed ? (
                    <Button
                      className="bg-card"
                      variant="outline"
                      size="icon"
                      onClick={onExpandPriorityList}
                    >
                      <ChevronRightIcon />
                    </Button>
                  ) : (
                    <Button
                      className="bg-card"
                      variant="outline"
                      size="icon"
                      onClick={onCollapsePriorityList}
                    >
                      <ChevronLeftIcon />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <MusclePrioritizationList
                  onMuscleClick={onMuscleClick}
                  isCollapsed={isPriorityListCollapsed}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex h-full flex-col space-y-3 overflow-y-scroll">
            <div className="flex flex-col space-y-3">
              <div className="flex w-full space-x-3">
                <Card>
                  <CardHeader>2. Frequency</CardHeader>
                  <CardContent>
                    <FrequencySelection />
                  </CardContent>
                </Card>

                <Card className="w-full">
                  <CardHeader>3. Split</CardHeader>
                  <CardContent>
                    <Split />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>Split Overview</CardHeader>
                <CardContent>
                  <TrainingWeek />
                </CardContent>
              </Card>
            </div>

            <Actions />

            <div className="flex flex-col rounded-lg">
              <UnderlineTabs
                tabList={TABS}
                selectedTab={selectedTab}
                onSelectTab={onSelectTab}
              />
              {SelectedTab()}
            </div>
          </div>
        </div>
      </div>
    </ProgramConfigProvider>
  );
}

type UnderlineTabsProps = {
  tabList: readonly TabKey[];
  selectedTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
};
function UnderlineTabs({
  tabList,
  selectedTab,
  onSelectTab,
}: UnderlineTabsProps) {
  const unselectedClasses = "rounded-none text-primary-300 hover:bg-background";
  const selectedClasses =
    "border-b border-foreground rounded-none hover:bg-background";
  return (
    <div className="mb-6 w-full border-b border-primary-600">
      {tabList.map((tab, index) => {
        const isSelected = tab === selectedTab;
        const presentationalTab = tab
          .split("-")
          .map((tab) => tab.charAt(0).toUpperCase() + tab.slice(1))
          .join(" ");
        return (
          <Button
            variant="ghost"
            className={isSelected ? selectedClasses : unselectedClasses}
            onClick={() => onSelectTab(tab)}
          >
            {presentationalTab}
          </Button>
        );
      })}
    </div>
  );
}

const OPTIONS = [1, 2, 3, 4, 5, 6, 7];

function FrequencySelection() {
  const { frequency, onFrequencyChange } = useProgramConfigContext();

  const handleSelectChange = useCallback(
    (value: number) => {
      onFrequencyChange([value, frequency[1]]);
    },
    [frequency, onFrequencyChange]
  );

  const unselectedButtonClasses = "bg-card";
  const selectedButtonClasses = "scale-110 border-secondary-300";
  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2">
        {OPTIONS.map((option) => {
          return (
            <Button
              variant="outline"
              className={
                option === frequency[0]
                  ? selectedButtonClasses
                  : unselectedButtonClasses
              }
              onClick={() => handleSelectChange(option)}
            >
              <div
                className={`${
                  option === frequency[0] ? "text-white" : "text-primary-300"
                }`}
              >
                {option}
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
