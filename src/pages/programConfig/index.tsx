import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { HTMLAttributes, ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/utils";
import Actions from "./components/SettingsSidePanel/Actions";
import FrequencySelection from "./components/SettingsSidePanel/FrequencySelection";
import { MusclePrioritizationList } from "./components/SettingsSidePanel/MusclePrioritization";
import SplitSelect from "./components/SettingsSidePanel/SplitSelect";
import VolumeSelect from "./components/SettingsSidePanel/VolumeSelect";
import { CustomizationPage } from "./components/Tabs";
import { ProgramSettingsProvider } from "./hooks/useProgramSettings";

export default function ProgramConfig() {
  return (
    <TrainingProgramProvider>
      <div className="flex h-full space-x-5">
        <ProgramConfiguration />
        <CustomizationPage />
      </div>
    </TrainingProgramProvider>
  );
}

const ProgramConfiguration = () => {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  return (
    <div className="flex h-full flex-col justify-between bg-primary-600">
      <div className="flex items-center justify-between">
        {isPriorityListCollapsed ? (
          <div className="p-3 pr-0">
            <GearIcon className="h-5 w-5" />
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-3">
            <GearIcon className="h-5 w-5" />
            <h2 className="text-nowrap">Program Settings</h2>
          </div>
        )}

        <div className="mt-0.5 p-3">
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
      </div>

      <div className="flex h-full flex-col overflow-y-auto p-3">
        <ProgramSettingsProvider>
          {isPriorityListCollapsed ? (
            <></>
          ) : (
            <ProgramSettings isCollapsed={isPriorityListCollapsed} />
          )}
        </ProgramSettingsProvider>
      </div>
    </div>
  );
};

interface ProgramConfigOptionCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  children: ReactNode;
}
function ProgramConfigOptionCard({
  title,
  children,
  ...props
}: ProgramConfigOptionCardProps) {
  return (
    <div
      {...props}
      className={cn("flex w-full justify-between", props.className)}
    >
      <h2 className="text-nowrap p-2 text-xs font-semibold text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}

type ProgramSettingsProps = {
  isCollapsed: boolean;
};
function ProgramSettings({ isCollapsed }: ProgramSettingsProps) {
  return (
    <div className="flex h-full overflow-y-auto">
      <div className="flex h-full w-60 flex-col">
        <div className="flex flex-col space-y-3 p-3">
          <ProgramConfigOptionCard title="1. Frequency">
            <FrequencySelection />
          </ProgramConfigOptionCard>

          <ProgramConfigOptionCard title="2. Split">
            <SplitSelect />
          </ProgramConfigOptionCard>

          <ProgramConfigOptionCard title="3. Volume">
            <VolumeSelect />
          </ProgramConfigOptionCard>
        </div>

        <div className="p-3 pt-0">
          <ProgramConfigOptionCard title="4. Prioritize" className="flex-col">
            <MusclePrioritizationList isCollapsed={isCollapsed} />
          </ProgramConfigOptionCard>
        </div>
        <Actions />
      </div>
    </div>
  );
}
