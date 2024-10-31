import { Cross2Icon, DotsVerticalIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import SelectExercise from "~/components/Modals/ChangeExerciseModal/ChangeExerciseModal";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  ExerciseType,
  MusclePriorityType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import ExerciseItem from "./ExerciseItem";

type DayItemProps = {
  index: number;
  exercises: ExerciseType[];
  muscle: MusclePriorityType;
};

export default function DayItem({ index, exercises, muscle }: DayItemProps) {
  const [sessions, setSessions] = useState([1]);

  const onAddSession = () => {
    setSessions((prev) => [...prev, 1]);
  };

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 ">
        <CardTitle>Day {index + 1}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <DotsVerticalIcon fill="white" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44">
            <DropdownMenuItem>
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
              <Session
                index={sessionIndex}
                exercises={exercises}
                muscle={muscle}
              >
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

type SessionProps = {
  index: number;
  exercises: ExerciseType[];
  muscle: MusclePriorityType;
  children: React.ReactNode;
};
function Session({ index, exercises, muscle, children }: SessionProps) {
  return (
    <div className="pt-3">
      {children}
      <ul className="space-y-2">
        {exercises.map((exercise, exerciseIndex) => {
          return (
            <ExerciseItem
              index={exerciseIndex}
              exercise={exercise}
              muscle={muscle}
            />
          );
        })}
      </ul>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="mt-2 w-full">
            Add Exercise
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[960px]">
          <DialogHeader>
            <DialogTitle>Replace Exercise</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <SelectExercise
            muscle={muscle}
            exerciseId={""}
            onSelect={() => {}}
            onClose={() => {}}
          />

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type SessionHeaderProps = {
  children: React.ReactNode;
};
function SessionHeader({ children }: SessionHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between pb-3 pt-0 text-sm text-card-foreground">
      {children}
    </div>
  );
}

function SessionTitle({ children }: SessionHeaderProps) {
  return (
    <h4 className="font-semibold leading-none tracking-tight">{children}</h4>
  );
}

function SessionDelete({ children }: SessionHeaderProps) {
  return <div className="">{children}</div>;
}
