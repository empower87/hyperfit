import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import Actions from "./components/Actions";
import FrequencySelection from "./components/FrequencySelection";
import MusclePrioritization from "./components/MusclePrioritization";
import { Split, TrainingWeek } from "./components/Split/SplitOverview";
import CustomizationTabs from "./components/Tabs";
import { ProgramConfigProvider } from "./hooks/useProgramConfig";

export default function ProgramConfig() {
  return (
    <div className="flex h-full flex-col pt-10">
      <h1 className="mb-5 text-white">Program Configuration</h1>
      <TrainingProgramProvider>
        <ProgramConfigProvider>
          <div className="flex h-full space-x-5">
            <div className="h-full">
              <MusclePrioritization />
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
        </ProgramConfigProvider>
      </TrainingProgramProvider>
    </div>
  );
}
