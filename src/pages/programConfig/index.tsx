import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

import { Split, TrainingWeek } from "./components/Split/SplitOverview";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Actions from "./components/Actions";
import MusclePrioritizationList from "./components/MusclePrioritization";
import { EditTabs } from "./components/Tabs";
import {
  ProgramConfigProvider,
  useProgramConfigContext,
} from "./hooks/useProgramConfig";

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

          <div className="flex h-full flex-col space-y-3 overflow-y-scroll pb-14">
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
              <EditTabs />
            </div>
          </div>
        </div>
      </div>
    </ProgramConfigProvider>
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
