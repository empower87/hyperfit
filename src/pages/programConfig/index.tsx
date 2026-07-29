import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GearIcon,
} from "@radix-ui/react-icons";
import { HTMLAttributes, ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TrainingProgramProvider } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/utils";
import Actions from "~/components/programConfig/ProgramConfiguration/Actions";
import FrequencySelection from "~/components/programConfig/ProgramConfiguration/FrequencySelection";
import { MusclePrioritizationList } from "~/components/programConfig/ProgramConfiguration/MusclePrioritization";
import { ProgramConfigurationSettings } from "~/components/programConfig/ProgramConfiguration/ProgramConfiguration";
import SplitSelect, {
  ProgramSettingsSelect,
} from "~/components/programConfig/ProgramConfiguration/SplitSelect";
import VolumeSelect from "~/components/programConfig/ProgramConfiguration/VolumeSelect";
import { CustomizationPage } from "~/components/programConfig/Tabs";
import { ProgramSettingsProvider } from "~/hooks/programConfig/useProgramSettings";

export default function ProgramConfig() {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);

  const onClickHandler = isPriorityListCollapsed
    ? onExpandPriorityList
    : onCollapsePriorityList;
  return (
    <TrainingProgramProvider>
      <div className={`flex h-full flex-col overflow-scroll`}>
        <ProgramConfigurationSettings
          isPriorityListCollapsed={isPriorityListCollapsed}
          onClick={onClickHandler}
        />
        <CustomizationPage className={isPriorityListCollapsed ? "mt-24" : ""} />
      </div>
    </TrainingProgramProvider>
  );
}

// Side Panel Version
// export default function ProgramConfig() {
//   return (
//     <TrainingProgramProvider>
//       <div className="flex h-full space-x-5">
//         <ProgramConfigurationSettings />
//         <CustomizationPage />
//       </div>
//     </TrainingProgramProvider>
//   );
// }

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
            <h2 className="text-nowrap">Create Program</h2>
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
export function ProgramConfigOptionCard({
  title,
  children,
  ...props
}: ProgramConfigOptionCardProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full items-center justify-between",
        props.className
      )}
    >
      <h2 className="text-nowrap p-2 text-xs font-semibold text-muted-foreground">
        {title}
      </h2>
      {children}
    </div>
  );
}

const MESOCYCLES = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
};
const MICROCYCLES = {
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "11",
  12: "12",
};

type MesocyclesSelectProps = {
  placeholder: string;
  items: Record<string, string>;
};
function MesosyclesSelect({ placeholder, items }: MesocyclesSelectProps) {
  return (
    <ProgramSettingsSelect
      onChange={() => {}}
      placeholder={placeholder}
      items={items}
    />
  );
}

type ProgramSettingsProps = {
  isCollapsed: boolean;
};
function ProgramSettings({ isCollapsed }: ProgramSettingsProps) {
  return (
    <div className="flex h-full overflow-y-auto">
      <div className="flex h-full w-64 flex-col">
        <div className="flex flex-col">
          <SavedTrainingPrograms />

          <div className="flex space-x-2">
            <ProgramConfigOptionCard title="Mesocycles">
              <MesosyclesSelect placeholder="3" items={MESOCYCLES} />
            </ProgramConfigOptionCard>

            <ProgramConfigOptionCard title="Microcycles">
              <MesosyclesSelect placeholder="4" items={MICROCYCLES} />
            </ProgramConfigOptionCard>
          </div>

          <div className="my-2 h-px w-full bg-gray-300"></div>

          <div className="flex space-x-2 p-3">
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
            <ProgramConfigOptionCard
              title="4. Prioritize"
              className="items-start"
            >
              <MusclePrioritizationList isCollapsed={isCollapsed} />
            </ProgramConfigOptionCard>
          </div>
          <Actions />
        </div>
      </div>
    </div>
  );
}

const PROGRAM_DUMMY = {
  id: "program_1",
  name: "Program 1",
  mesocycles: {
    1: {
      id: "mesocycle_1",
      name: "Mesocycle 1",
      data: [],
    },
    2: {
      id: "mesocycle_2",
      name: "Mesocycle 2",
      data: [],
    },
  },
};

const SAVED_PROGRAMS_DUMMY = [
  { ...PROGRAM_DUMMY },
  { ...PROGRAM_DUMMY, id: "program_2", name: "Program 2" },
  { ...PROGRAM_DUMMY, id: "program_3", name: "Program 3" },
];

const SavedTrainingPrograms = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>();
  const untitled_program = "Untitled Program";
  return (
    <div className="flex flex-col border-b border-primary-400 p-2 pt-0">
      <h2 className="p-2">Training Program</h2>
      <div className="flex items-center">
        <Input
          placeholder={selectedProgram ? selectedProgram : untitled_program}
          className="mb-2 w-full"
        />
        <ProgramConfigurationPanel />
      </div>
    </div>
  );
};

type ProgramConfigurationPanelProps = {
  savedTrainingPrograms?: Record<string, string>[];
  selectedProgramId?: string;
};
const ProgramConfigurationPanel = ({
  savedTrainingPrograms,
  selectedProgramId,
}: ProgramConfigurationPanelProps) => {
  const programs = savedTrainingPrograms || SAVED_PROGRAMS_DUMMY;
  return (
    <div className="p-2">
      <Select>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={programs[0]?.id} />
        </SelectTrigger>

        <SelectContent>
          {programs.map((item, index) => {
            return (
              <SelectItem
                key={`${item}_${index}_SavedTrainingPrograms`}
                value={item.id}
              >
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
