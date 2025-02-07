import { Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Set } from "~/types/Exercise";
import { useActiveWorkoutContext } from "../../hooks/useActiveWorkout";

export function ExerciseHistory() {
  const { active_workout, selectedExerciseHistoryId, onExerciseNameClick } =
    useActiveWorkoutContext();
  if (!selectedExerciseHistoryId.length) return null;

  const selectedExerciseHistory =
    active_workout &&
    active_workout.session.exercises.find(
      (ex) => ex.id === selectedExerciseHistoryId
    );
  return (
    <Card className="h-full w-[360px]">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-secondary-400">
          {selectedExerciseHistory?.name}
        </CardTitle>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onExerciseNameClick("")}
        >
          <Cross1Icon fill="white" />
        </Button>
      </CardHeader>

      <CardContent className="h-full">
        <div className="flex p-2">History</div>
        <div className="flex h-1/2 flex-col space-y-4 overflow-scroll">
          {selectedExerciseHistory &&
            PREV_EXERCISE_DATA.map((session) => {
              return (
                <ExerciseHistoryCard
                  session_name={session.session_name}
                  session_date={session.session_date}
                  exercise_id={session.exercise_id}
                  sets={session.sets}
                />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

type ExerciseHistoryCardProps = {
  session_name: string;
  session_date: string;
  exercise_id: string;
  sets: Set[];
};
function ExerciseHistoryCard({
  session_name,
  session_date,
  exercise_id,
  sets,
}: ExerciseHistoryCardProps) {
  return (
    <div className="flex flex-col rounded-md border border-input p-3">
      <div className="pb-2 leading-tight">
        <h2 className="">{session_name}</h2>
        <p className="text-sm text-muted-foreground">{session_date}</p>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h3 className="">Sets Performed</h3>
          <h3 className="">1RM</h3>
        </div>
        {sets.map((set) => {
          return (
            <div className="flex justify-between text-sm text-muted-foreground">
              <div className="flex space-x-2">
                <p className="">{set.set_num}</p>
                <p className="">
                  {set.weight}lbs x {set.reps}
                </p>
              </div>

              <p className="">{set.rir}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- (1/15/25) TESTING MOCK DATA FOR EXERCISE HISTORY ---

const SESSION_EXERCISE_DATA = {
  session_id: "session_1",
  session_name: "Session 1",
  session_date: "2022-01-01",
  exercise_id: "exercise_1",
  exercise_name: "Bicep Curl",
  sets: [
    {
      set_num: 1,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 2,
      reps: 11,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 3,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: true,
    },
    {
      set_num: 4,
      reps: 12,
      weight: 100,
      rir: 3,
      isCompleted: false,
    },
  ],
};

const PREV_EXERCISE_DATA = [
  { ...SESSION_EXERCISE_DATA },
  {
    ...SESSION_EXERCISE_DATA,
    session_id: "session_2",
    session_name: "Session 2",
  },
  {
    ...SESSION_EXERCISE_DATA,
    session_id: "session_3",
    session_name: "Session 3",
  },
  {
    ...SESSION_EXERCISE_DATA,
    session_id: "session_4",
    session_name: "Session 4",
  },
  {
    ...SESSION_EXERCISE_DATA,
    session_id: "session_5",
    session_name: "Session 5",
  },
];
