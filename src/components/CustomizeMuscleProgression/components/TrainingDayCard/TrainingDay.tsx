import { Cross2Icon, DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useMuscleEditorContext } from "../../context/MuscleEditorContext";
import { Session, SessionDelete, SessionHeader, SessionTitle } from "./Session";

type TrainingDayProps = {
  index: number;
  exercises: ExerciseType[];
};

export default function TrainingDay({ index, exercises }: TrainingDayProps) {
  const { onRemoveTrainingDay } = useMuscleEditorContext();
  const [sessions, setSessions] = useState([1]);

  const onAddSession = () => {
    setSessions((prev) => [...prev, 1]);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Day {index + 1}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <DotsVerticalIcon fill="white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44">
            <DropdownMenuItem onClick={() => onRemoveTrainingDay(index)}>
              <div className="text-red-500">Remove Training Day</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {sessions.map((session, sessionIndex) => {
            const isSingleSession = sessions.length <= 1;
            return (
              <Session index={sessionIndex} exercises={exercises}>
                {isSingleSession ? (
                  <></>
                ) : (
                  <SessionHeader>
                    <SessionTitle>Session {sessionIndex + 1}</SessionTitle>
                    <SessionDelete>
                      <Button variant="ghost" size="icon">
                        <Cross2Icon fill="white" />
                      </Button>
                    </SessionDelete>
                  </SessionHeader>
                )}
              </Session>
            );
          })}
        </ul>

        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={onAddSession}
        >
          Add Session
        </Button>
      </CardContent>
    </Card>
  );
}
