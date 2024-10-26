import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import ExerciseItem from "./ExerciseItem";

type DayItemProps = {
  index: number;
  exercises: ExerciseType[];
};

export default function DayItem({ index, exercises }: DayItemProps) {
  const [sessions, setSessions] = useState([1]);

  const onAddSession = () => {
    setSessions((prev) => [...prev, 1]);
  };
  return (
    <Card>
      <CardHeader>Day {index + 1}</CardHeader>
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

type SessionProps = {
  index: number;
  exercises: ExerciseType[];
  children: React.ReactNode;
};
function Session({ index, exercises, children }: SessionProps) {
  return (
    <div className="pt-3">
      {children}
      <ul className="space-y-2">
        {exercises.map((exercise, exerciseIndex) => {
          return <ExerciseItem index={exerciseIndex} exercise={exercise} />;
        })}
      </ul>
      <Button variant="ghost" className="mt-2 w-full">
        Add Exercise
      </Button>
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
