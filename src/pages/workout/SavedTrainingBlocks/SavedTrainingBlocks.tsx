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
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { NewTrainingWeek } from "~/hooks/useTrainingProgram/utils/training_block/trainingBlockHelpers";

const createTrainingBlockData = (
  training_block: NewTrainingWeek[][] | TrainingDayType[][]
) => {
  const lol = training_block.map((meso, index) => {
    return {
      mesocycle: index + 1,
      sessions: meso.map((session, i) => ({
        name: session.day,
        split: session.sessions.length ? session.sessions[0].split : "off",
      })),
    };
  });
};

const TBLOCK_TEST: NewTrainingWeek[][] | TrainingDayType[][] = [
  [
    {
      day: "Monday",
      isTrainingDay: true,
      sessions: [{ id: "0329", split: "upper", exercises: [] }],
    },
  ],
  [],
  [],
];
export default function SavedTrainingBlocks() {
  const { training_block } = useTrainingProgramContext();
  const [openedTrainingBlockId, setOpenedTrainingBlockId] = useState("");
  const training_blocks = [TBLOCK_TEST, TBLOCK_TEST];
  console.log(training_block, "data here?");
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <h2>My Training Blocks</h2>
      </CardHeader>
      <CardContent>
        <ul>
          {training_blocks.map((block, index) => {
            return <TrainingBlockItem index={index} training_block={block} />;
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
  const [isTrainingBlockOpen, setIsTrainingBlockOpen] = useState(false);
  // const [isMesocycleOpen, setIsMesocycleOpen] = useState(false)
  return (
    <div className="flex">
      <Collapsible
        open={isTrainingBlockOpen}
        onOpenChange={setIsTrainingBlockOpen}
        className="w-[350px]"
      >
        <CollapsibleTrigger asChild>
          <Button
            className={`${isTrainingBlockOpen ? "bg-card" : ""}`}
            variant="ghost"
            size="sm"
          >
            <div className="text-sm">Training Block {index + 1}</div>
            <ChevronsUpDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Collapsible className="flex w-full flex-col items-start pl-5">
            {training_block.map((meso, index) => {
              return (
                <>
                  <CollapsibleTrigger>
                    <Button variant="ghost" size="sm">
                      <div className="text-sm">Mesocycle {index + 1}</div>
                      <ChevronsUpDown className="h-4 w-4" />
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="flex flex-col pl-4">
                      {meso.map((week, i) => {
                        const hasSession = week.sessions[0]
                          ? week.sessions[0].split
                          : false;
                        if (!hasSession) return null;
                        return <div>{week.sessions[0].split}</div>;
                      })}
                    </div>
                  </CollapsibleContent>
                </>
              );
            })}
          </Collapsible>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
