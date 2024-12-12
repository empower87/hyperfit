import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Actions from "./components/Actions";
import FrequencySelection from "./components/FrequencySelection";
import MusclePrioritizationList from "./components/MusclePrioritization";
import { Split, TrainingWeek } from "./components/Split/SplitOverview";
import CustomizationTabs from "./components/Tabs";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

export default function ProgramConfig() {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);

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
                  isCollapsed={isPriorityListCollapsed}
                />
              </CardContent>
            </Card>
          </div>

          <div className="flex h-full flex-col space-y-3 overflow-y-scroll pb-14 pr-1">
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
                  <Actions />
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col rounded-lg">
              <CustomizationTabs />
            </div>
          </div>
        </div>
      </div>
    </ProgramConfigProvider>
  );
}
