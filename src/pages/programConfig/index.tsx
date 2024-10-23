import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";
import Configuration from "~/components/Configuration";
import MusclePrioritization from "~/components/Configuration/components/MusclePrioritization/MusclePrioritization";
import {
  Split,
  TrainingWeek,
} from "~/components/Configuration/components/Split/SplitOverview";
import {
  ProgramConfigProvider,
  useProgramConfigContext,
} from "~/components/Configuration/hooks/useProgramConfig";
import { Contents } from "~/components/CustomizeMuscleProgression/components/EditorPopout/MuscleGroup";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";

const TABS = ["training-week-overview", "edit-muscle"];

export default function ProgramConfig() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [selectedMuscleId, setSelectedMuscleId] =
    useState<MusclePriorityType["id"]>("");
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);
  const [selectedTab, setSelectedTab] = useState("training-week-overview");
  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  const onSelectTab = (tab: string) => setSelectedTab(tab);

  const onMuscleClick = (id: MusclePriorityType["id"]) => {
    setSelectedMuscleId(id);
  };

  const selectedMuscle = prioritized_muscle_list.filter(
    (muscle) => muscle.id === selectedMuscleId
  )[0];

  return (
    <ProgramConfigProvider>
      <div className="mt-6 flex flex-col">
        <h1 className="mb-5 text-white">Program Configuration</h1>
        <div className="flex space-x-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between space-x-2 border-b border-primary-500 pb-2 ">
                <CardTitle>1. Priority</CardTitle>
                {isPriorityListCollapsed ? (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onExpandPriorityList}
                  >
                    <ChevronRightIcon className="" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onCollapsePriorityList}
                  >
                    <ChevronLeftIcon className="" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <MusclePrioritization
                onMuscleClick={onMuscleClick}
                isCollapsed={isPriorityListCollapsed}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-3">
            <Configuration>
              <Configuration.Layout>
                <div className="flex space-x-3">
                  <Card>
                    <CardHeader>2. Frequency</CardHeader>
                    <CardContent>
                      <FrequencySelection />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>3. Split</CardHeader>
                    <CardContent>
                      <Split />
                    </CardContent>
                  </Card>
                </div>

                {/* <TrainingWeek /> */}
                <Configuration.Actions />
              </Configuration.Layout>
            </Configuration>

            <div className="flex flex-col rounded-lg">
              <UnderlineTabs
                tabList={TABS}
                selectedTab={selectedTab}
                onSelectTab={onSelectTab}
              />
              {selectedTab === "training-week-overview" ? (
                <TrainingWeek />
              ) : null}
              {selectedMuscleId && selectedTab === "edit-muscle" ? (
                // <Days muscleGroup={selectedMuscle} />
                <Contents selectedMuscle={selectedMuscle} />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ProgramConfigProvider>
  );
}

type UnderlineTabsProps = {
  tabList: string[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
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

  const selectedButtonClasses = "scale-110 border-secondary-300";
  return (
    <div className="flex">
      <div></div>
      <div className="flex space-x-2">
        {OPTIONS.map((option) => {
          return (
            <Button
              variant="outline"
              className={option === frequency[0] ? selectedButtonClasses : ""}
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
