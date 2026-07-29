import { ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { TrainingDayType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";
import { cn } from "~/lib/utils";
import { getSplitColor } from "~/utils/getIndicatorColors";
import { useActiveWorkoutContext } from "~/hooks/workout/useActiveWorkoutContext";

export default function SavedTrainingBlocks() {
  const { savedTrainingBlocks } = useActiveWorkoutContext();

  return (
    <Card className="w-[360px]">
      <CardHeader>
        <h2>Saved Training Blocks</h2>
      </CardHeader>
      <CardContent>
        <ul>
          {savedTrainingBlocks.map((block, index) => {
            return (
              <TrainingBlockItem
                key={`SavedTrainingBlocks_savedTrainingBlocks_${index}`}
                index={index}
                training_block={block}
              />
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

type TrainingBlockItemProps = {
  index: number;
  training_block: NewTrainingWeek[][] | TrainingDayType[][];
};

function TrainingBlockItem({ index, training_block }: TrainingBlockItemProps) {
  const { onSelectWorkout, localStorageTrainingProgram } =
    useActiveWorkoutContext();
  const [isTrainingBlockOpen, setIsTrainingBlockOpen] = useState(false);
  const params = localStorageTrainingProgram?.training_program_params;

  const MICROCYCLES = params ? params.microcycles : 4;
  const weeks = Array.from(Array(MICROCYCLES), (e, i) => `WK ${i + 1}`);
  const [selectedWeek, setSelectedWeek] = useState<
    [number, number, number, number] | null
  >(null);

  const onSelectWorkoutHandler = (
    tbs_index: number,
    tb_index: number,
    meso_index: number,
    micro_index: number
  ) => {
    setSelectedWeek([tbs_index, tb_index, meso_index, micro_index]);
    onSelectWorkout(tbs_index, tb_index, meso_index, micro_index);
  };

  return (
    <li className="flex">
      <Collapsible
        open={isTrainingBlockOpen}
        onOpenChange={setIsTrainingBlockOpen}
        className="w-[350px]"
      >
        <CollapsibleTrigger asChild>
          <Button
            className={`flex w-full justify-between text-muted-foreground ${
              isTrainingBlockOpen ? " bg-card text-white" : ""
            }`}
            variant="ghost"
            size="sm"
          >
            <div className="text-sm">Training Block {index + 1}</div>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {training_block.map((meso, tbIndex) => {
            return (
              <Collapsible
                key={`TrainingBlockItem_training_block_map_${tbIndex}`}
                className="flex w-full flex-col items-start pl-5"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex w-full justify-between"
                  >
                    <div className="text-sm">Mesocycle {tbIndex + 1}</div>
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="flex flex-col space-y-2 p-2 pl-4 ">
                    {meso.map((week, mesoIndex) => {
                      const hasSession =
                        week.sessions[0] && week.sessions[0].split !== "off"
                          ? week.sessions[0].split
                          : false;
                      if (!hasSession) return null;
                      const splitColor = getSplitColor(week.sessions[0].split);

                      return (
                        <div
                          key={`TrainingBlockItem_training_block_map_meso_map_${week.day}_${mesoIndex}`}
                          className={`flex w-full flex-col space-x-1 rounded-md border border-input`}
                        >
                          <div
                            className={cn(
                              `flex w-full rounded p-2 leading-tight`
                            )}
                          >
                            <div
                              className={`${splitColor.bg} rounded p-1 px-2 font-semibold`}
                            >
                              {week.sessions[0].split}
                            </div>
                            <div className=" p-1 px-2 text-xs text-primary-400">
                              {week.day}
                            </div>
                          </div>

                          <div className="flex space-x-1 p-2 pt-0">
                            {weeks.map((micro, microIndex) => {
                              let isSelected = true;
                              if (selectedWeek) {
                                if (selectedWeek[0] !== index) {
                                  isSelected = false;
                                }
                                if (selectedWeek[1] !== tbIndex) {
                                  isSelected = false;
                                }
                                if (selectedWeek[2] !== mesoIndex) {
                                  isSelected = false;
                                }
                                if (selectedWeek[3] !== microIndex) {
                                  isSelected = false;
                                }
                              } else {
                                isSelected = false;
                              }
                              const selectedClasses = isSelected
                                ? "bg-primary-500 border-secondary-300"
                                : "bg-card";

                              return (
                                <Button
                                  key={`TrainingBlockItem_training_block_map_meso_map_weeks_${micro}_${microIndex}`}
                                  variant="outline"
                                  size="sm"
                                  className={`py-1 ${selectedClasses}`}
                                  onClick={() =>
                                    onSelectWorkoutHandler(
                                      index,
                                      tbIndex,
                                      mesoIndex,
                                      microIndex
                                    )
                                  }
                                >
                                  {micro}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}
