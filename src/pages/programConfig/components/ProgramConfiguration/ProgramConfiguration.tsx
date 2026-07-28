import {
  ChevronDownIcon,
  ChevronUpIcon,
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
import { useTrainingProgram } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/utils";
import { getRankColor } from "~/utils/getIndicatorColors";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
import { ProgramSettingsProvider } from "../../hooks/useProgramSettings";
import Actions from "./Actions";
import FrequencySelection from "./FrequencySelection";
import { MusclePrioritizationList } from "./MusclePrioritization";
import SplitSelect from "./SplitSelect";
import ToggleMesocycle from "./ToggleMesocycle/ToggleMesocycle";
import VolumeSelect from "./VolumeSelect";

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

type ProgramSettingsProps = {
  isCollapsed: boolean;
};
function ProgramSettings({ isCollapsed }: ProgramSettingsProps) {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  return (
    <div className="flex w-full">
      <div className="flex flex-col justify-between">
        <SavedTrainingPrograms />
        <div className="px-4 pb-3">
          <ToggleMesocycle mesocycles={4} />
        </div>
        <Actions />
      </div>

      <div className="flex p-3 pt-0">
        <div className="w-54 flex flex-col space-y-2 p-3 pt-0">
          <ProgramConfigOptionCard
            title="1. Frequency"
            className="flex-col items-start"
          >
            <FrequencySelection />
          </ProgramConfigOptionCard>

          <ProgramConfigOptionCard
            title="2. Split"
            className="flex-col items-start"
          >
            <SplitSelect />
          </ProgramConfigOptionCard>

          <ProgramConfigOptionCard
            title="3. Volume"
            className="flex-col items-start"
          >
            <VolumeSelect />
          </ProgramConfigOptionCard>
        </div>
        <ProgramConfigOptionCard
          title="3. Prioritize"
          className="flex-col items-start"
        >
          <MusclePrioritizationList isCollapsed={isCollapsed} />
        </ProgramConfigOptionCard>
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
    <div className="flex flex-col px-4 pb-3">
      <h3 className="p-2 pb-0 text-sm font-semibold text-primary-300">
        Training Program
      </h3>
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

const ProgramConfigurationSettingsCollapsed = () => {
  const {
    prioritized_muscle_list,
    split_sessions,
    frequency,
    training_program_params,
  } = useTrainingProgram();
  const { mesocycles } = training_program_params;
  return (
    <div className="flex w-full">
      <div className="flex">
        <div className="p-2 pl-3 pr-4 text-sm font-semibold text-primary-300">
          Training Program Name
        </div>

        <div className="grid grid-cols-1 pl-0 pr-4 pt-2">
          <div className="p-1 pb-0 text-xs font-semibold text-primary-300">
            Mesocycle
          </div>
          <div className="text-center">{mesocycles}</div>
        </div>

        <div className="grid grid-cols-3 pl-0 pr-4 pt-2 text-primary-300">
          <div className="p-1 pb-0 text-center text-xs text-primary-300">
            Frequency
          </div>
          <div className="p-1 pb-0 text-center text-xs text-primary-300">
            Split
          </div>
          <div className="p-1 pb-0 text-center text-xs text-primary-300">
            Volume
          </div>
          <div className="text-center text-sm text-white">{frequency[0]}</div>
          <div className="text-center text-sm text-white">
            {split_sessions.split}
          </div>
          <div className="text-center text-sm text-white">High</div>
        </div>
      </div>

      <div className="flex w-fit items-center space-x-2 overflow-x-scroll p-2 pr-4">
        {prioritized_muscle_list.map((muscle, index) => {
          const bgColor = getRankColor(muscle.volume.landmark).bg;
          return (
            <div
              key={`${muscle}_${index}_ProgramConfigurationSettingsCollapsed`}
              className={`p-2 text-xs ${bgColor} text-nowrap rounded`}
            >
              {getMuscleTitleForUI(muscle.muscle)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

type CollapsePanelButtonProps = {
  isCollapsed: boolean;
  onClick: () => void;
};
const CollapsePanelButton = ({
  isCollapsed,
  onClick,
}: CollapsePanelButtonProps) => {
  return (
    <div className="flex justify-center p-1 hover:bg-primary-500">
      <Button
        variant="ghost"
        onClick={onClick}
        className="hover:bg-primary-500"
      >
        {isCollapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
      </Button>
    </div>
  );
};

type ProgramConfigurationSettingsProps = {
  isPriorityListCollapsed: boolean;
  onClick: () => void;
};
export const ProgramConfigurationSettings = ({
  isPriorityListCollapsed,
  onClick,
}: ProgramConfigurationSettingsProps) => {
  // const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);

  // const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  // const onExpandPriorityList = () => setIsPriorityListCollapsed(false);
  // const onClickHandler = isPriorityListCollapsed
  //   ? onExpandPriorityList
  //   : onCollapsePriorityList;
  return (
    <div
      className={`flex flex-col justify-between bg-primary-600 ${
        isPriorityListCollapsed ? "fixed z-50" : ""
      }`}
    >
      <ProgramSettingsProvider>
        {isPriorityListCollapsed ? (
          <ProgramConfigurationSettingsCollapsed />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 p-3">
                <GearIcon className="h-5 w-5" />
                <h2 className="text-nowrap">Create Program</h2>
              </div>
            </div>
            <ProgramSettings isCollapsed={isPriorityListCollapsed} />
          </>
        )}
      </ProgramSettingsProvider>
      <CollapsePanelButton
        isCollapsed={isPriorityListCollapsed}
        onClick={onClick}
      />
    </div>
  );
};
