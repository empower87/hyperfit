import { HTMLAttributes, ReactNode, useCallback, useState } from "react";
import Configuration from "~/components/Configuration";
import MusclePrioritization from "~/components/Configuration/components/MusclePrioritization/MusclePrioritization";
import {
  Split,
  TrainingWeek,
} from "~/components/Configuration/components/Split/SplitOverview";
import { useProgramConfigContext } from "~/components/Configuration/hooks/useProgramConfig";
import { Days } from "~/components/CustomizeMuscleProgression/components/EditorPopout/Contents";
import { MusclePriorityType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";

type TempCardProps = {
  header: string;
  children: ReactNode;
};
function TempCard({ header, children }: TempCardProps) {
  return (
    <div className="rounded-lg bg-primary-700 p-4">
      <h2 className="mb-5 border-b border-primary-500 pb-2 text-primary-300">
        {header}
      </h2>
      {children}
    </div>
  );
}
export default function ProgramConfig() {
  const { prioritized_muscle_list } = useTrainingProgramContext();
  const [selectedMuscleId, setSelectedMuscleId] =
    useState<MusclePriorityType["id"]>("");

  const onMuscleClick = (id: MusclePriorityType["id"]) => {
    setSelectedMuscleId(id);
  };

  return (
    <div className="mt-6 flex flex-col">
      <h1 className="mb-5 text-white">Program Configuration</h1>
      <div className="flex space-x-3">
        <div className="h-screen rounded-lg bg-primary-700 p-4">
          <h2 className="mb-5 border-b border-primary-500 pb-2 text-primary-300">
            1. Priority
          </h2>
          <MusclePrioritization onMuscleClick={onMuscleClick} />
        </div>
        {/* <TableOfContents /> */}

        <div className="flex flex-col space-y-3">
          <Configuration>
            <Configuration.Layout>
              <div className="flex space-x-3">
                <TempCard header="2. Frequency">
                  <FrequencySelection />
                </TempCard>

                <TempCard header="3. Split">
                  <Split />
                </TempCard>
              </div>

              <TrainingWeek />
              {/* <Configuration.Actions /> */}
            </Configuration.Layout>
          </Configuration>

          <div className="flex rounded-lg bg-primary-500 p-4">
            {selectedMuscleId ? (
              <Days
                days={
                  prioritized_muscle_list.filter(
                    (muscle) => muscle.id === selectedMuscleId
                  )[0].exercises
                }
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

const OPTIONS = [1, 2, 3, 4, 5, 6, 7];

interface FrequencyButtonProps extends HTMLAttributes<HTMLButtonElement> {
  value: number;
}
function FrequencyButton({ value, className, ...props }: FrequencyButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "h-8 w-8 rounded-md border border-primary-500 bg-primary-600 text-sm font-semibold text-primary-300 hover:bg-primary-500",
        className
      )}
    >
      {value}
    </button>
  );
}
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
      <div className="flex space-x-1">
        {OPTIONS.map((option) => {
          return (
            <FrequencyButton
              value={option}
              className={option === frequency[0] ? selectedButtonClasses : ""}
              onClick={() => handleSelectChange(option)}
            />
          );
        })}
      </div>
    </div>
  );
}
