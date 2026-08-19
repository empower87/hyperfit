import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GearIcon,
  Pencil1Icon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { HTMLAttributes, ReactNode, useCallback, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ProgramSettingsProvider } from "~/hooks/programConfig/useProgramSettings";
import { useTrainingProgram } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/utils";
import { getRankColor } from "~/utils/getIndicatorColors";
import getMuscleTitleForUI from "~/utils/getMuscleTitleForUI";
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

type TrainingProgramNameProps = {
  savedTrainingPrograms: SavedProgramDummyType[];
  selectedProgram: SavedProgramDummyType | undefined;
  isEditing: boolean;
  onClick: () => void;
};
function TrainingProgramName({
  savedTrainingPrograms,
  selectedProgram,
  isEditing,
  onClick,
}: TrainingProgramNameProps) {
  return (
    <div className="flex w-full items-center justify-between">
      {isEditing ? (
        <>
          <div className="pr-3">
            <Input
              placeholder={selectedProgram?.name || "Untitled Training Program"}
            />
          </div>
          <Button size="sm" className="bg-primary-700" onClick={onClick}>
            <CheckIcon />
          </Button>
        </>
      ) : (
        <>
          <h3>{selectedProgram?.name}</h3>
          <Button size="sm" className="bg-primary-700" onClick={onClick}>
            <Pencil1Icon />
          </Button>
        </>
      )}
    </div>
  );
}

type SavedProgramDummyType = {
  id: string;
  name: string;
  mesocycles: { [key: number]: { id: string; name: string; data: any[] } };
};
const PROGRAM_DUMMY: SavedProgramDummyType = {
  id: "program_1",
  name: "8 week Upper Specialization",
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
type ProgramSettingsProps = {
  isCollapsed: boolean;
};
function ProgramSettings({ isCollapsed }: ProgramSettingsProps) {
  const [isPriorityListCollapsed, setIsPriorityListCollapsed] = useState(false);
  const [savedTrainingPrograms, setSavedTrainingPrograms] =
    useState(SAVED_PROGRAMS_DUMMY);
  const [selectedProgramId, setSelectedProgramId] = useState<
    string | undefined
  >();
  const [isEditingProgramName, setIsEditingProgramName] = useState(false);

  const onCollapsePriorityList = () => setIsPriorityListCollapsed(true);
  const onExpandPriorityList = () => setIsPriorityListCollapsed(false);

  const onCreateNewProgram = () => {
    const newTrainingProgram = {
      ...PROGRAM_DUMMY,
      id: `program_${savedTrainingPrograms.length + 1}`,
      name: "Untitled Program",
    };
    setSavedTrainingPrograms((prevPrograms) => {
      return [...prevPrograms, newTrainingProgram];
    });
    setSelectedProgramId(newTrainingProgram.id);
  };

  const onProgramNameButtonClick = useCallback(() => {
    if (isEditingProgramName) {
      // Save the program name changes here
      setIsEditingProgramName(false);
    } else {
      setIsEditingProgramName(true);
    }
  }, [isEditingProgramName]);

  const selectedProgram = savedTrainingPrograms.find(
    (program) => program.id === selectedProgramId
  );
  return (
    <div className="flex w-full space-x-4 px-4 pt-3">
      <Card className="border-none bg-primary-700/50">
        <CardHeader>Training Program Settings</CardHeader>

        <div className="flex flex-col px-4 pb-3">
          <h4 className="p-2 pb-0 text-sm text-primary-400">
            Select Training Program
          </h4>

          <div className="flex items-center">
            <SavedTrainingPrograms
              savedTrainingPrograms={savedTrainingPrograms}
              selectedProgramId={selectedProgram?.id}
              onSelectProgramId={setSelectedProgramId}
            />
            <Button size="lg" onClick={onCreateNewProgram}>
              Create New
              <PlusIcon />
            </Button>
          </div>
        </div>

        {selectedProgram ? (
          <div className="px-4 pb-3">
            <Card className="">
              <CardHeader>Configure Selected Training Program</CardHeader>
              <div className="px-4">
                <TrainingProgramName
                  savedTrainingPrograms={savedTrainingPrograms}
                  selectedProgram={selectedProgram}
                  isEditing={isEditingProgramName}
                  onClick={onProgramNameButtonClick}
                />
              </div>

              <div className="px-4 pb-3">
                <ToggleMesocycle mesocycles={4} />
              </div>
            </Card>
          </div>
        ) : null}
      </Card>

      <Card className="border-none bg-primary-700/50">
        <CardHeader>Build Mesocycle</CardHeader>

        <div className="flex-col items-center p-4 pt-2">
          <h4 className="p-1 text-sm text-primary-400">Name</h4>
          <Input placeholder={"Name This Mesocycle"} className="mb-2" />
        </div>

        <div className="flex">
          <div className="flex-col">
            {/* <h3 className="p-2 pb-0 text-sm font-semibold text-primary-300">
            Build Mesocycle
          </h3> */}
            <div className="flex-col space-y-2 p-4 pt-0">
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
          </div>

          <ProgramConfigOptionCard
            title="3. Prioritize"
            className="flex-col items-start p-4 pt-1"
          >
            <div className="h-60 w-full overflow-auto">
              <MusclePrioritizationList isCollapsed={isCollapsed} />
            </div>
          </ProgramConfigOptionCard>
        </div>
      </Card>
    </div>
  );
}

type SavedTrainingProgramProps = {
  savedTrainingPrograms?: SavedProgramDummyType[];
  selectedProgramId: string | undefined;
  onSelectProgramId: (programId: string) => void;
};
const SavedTrainingPrograms = ({
  savedTrainingPrograms,
  selectedProgramId,
  onSelectProgramId,
}: SavedTrainingProgramProps) => {
  const programs: SavedProgramDummyType[] =
    savedTrainingPrograms || SAVED_PROGRAMS_DUMMY;
  const [selectedProgram, setSelectedProgram] = useState<string | undefined>(
    selectedProgramId
  );

  const handleSelectProgram = (programId: string) => {
    setSelectedProgram(programId);
    onSelectProgramId(programId);
  };

  return (
    <div className="p-2">
      <Select onValueChange={handleSelectProgram} value={selectedProgram}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder={selectedProgram} />
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
                <h2 className="text-nowrap">Build Training Program</h2>
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
