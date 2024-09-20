import { ReactNode } from "react";
import { DraggableExercises } from "~/components/TrainingWeekOverview/components/hooks/useExerciseSelection";
import {
  DayType,
  ExerciseType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { getExerciseSetsOverMicrocycles } from "~/hooks/useTrainingProgram/utils/exercises/getExercises";
import { cn } from "~/lib/clsx";
import {
  DayCell,
  ExerciseCellGroup,
  HeaderCell,
  HeaderCellGroup,
  SessionCell,
  WeekCellGroup,
} from "./Cells";
import { CELL_WIDTHS } from "./constants";

type DataRowProps = {
  exercise: ExerciseType;
  index: number;
  setProgression: number[];
};
function DataRow({ exercise, setProgression, index }: DataRowProps) {
  const details = setProgression.map((each) => {
    return [each, exercise.reps, exercise.weight, exercise.rir];
  });

  const exerciseData = [
    `${index}`,
    exercise.muscle,
    exercise.name,
    exercise.data.requirements[0] ?? "bodyweight",
    exercise.trainingModality,
  ];

  const alternatingBGColors =
    index % 2 === 0 ? "bg-primary-400" : `bg-zinc-400`;
  return (
    <li className={`flex flex-row space-x-1 overflow-hidden`}>
      <ExerciseCellGroup
        data={exerciseData}
        widths={CELL_WIDTHS.exercise.widths}
        bgColor={`${alternatingBGColors}`}
        volume_landmark={exercise.rank}
      />

      {details.map((each, index) => {
        return (
          <WeekCellGroup
            key={`${each[0]}_DataRow_${index}`}
            data={each}
            widths={CELL_WIDTHS.week.widths}
            bgColor={`${alternatingBGColors}`}
            volume_landmark={exercise.rank}
          />
        );
      })}

      {/* -- for uncoded DELOAD section -- */}
      <WeekCellGroup
        data={details[0]}
        widths={CELL_WIDTHS.week.widths}
        bgColor={`${alternatingBGColors}`}
        volume_landmark={exercise.rank}
      />
    </li>
  );
}

export function HeaderRow() {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;

  const MICROCYCLE_HEADERS = Array.from(
    Array(microcycles),
    (e, i) => `Week ${i + 1}`
  );

  return (
    <div className={`mb-1 flex space-x-1 text-slate-300`}>
      <div className={`bg-primary-700 ${CELL_WIDTHS.day} rounded`}>
        <div className={`flex justify-center text-[12px]`}>Day</div>
      </div>

      <HeaderCell label="Exercise">
        {CELL_WIDTHS.exercise.widths.map((width) => {
          return <div className={cn(``, width)}></div>;
        })}
      </HeaderCell>

      {MICROCYCLE_HEADERS.map((each, index) => {
        return (
          <HeaderCell label={each} key={`${each}_MicrocycleHeader_${index}`}>
            {CELL_WIDTHS.week.widths.map((width) => (
              <div className={`${width}`}></div>
            ))}
          </HeaderCell>
        );
      })}

      <HeaderCell label="Deload">
        {CELL_WIDTHS.week.widths.map((width) => (
          <div className={`${width}`}></div>
        ))}
      </HeaderCell>
    </div>
  );
}

type SessionSplitRowType = {
  exercises: ExerciseType[];
  currentMesocycleIndex: number;
  split: ReactNode;
};

function SessionSplitRow({
  exercises,
  currentMesocycleIndex,
  split,
}: SessionSplitRowType) {
  const { training_program_params, prioritized_muscle_list } =
    useTrainingProgramContext();
  const { microcycles } = training_program_params;

  return (
    <div
      className={cn(
        `mb-1 flex space-x-1 overflow-hidden rounded bg-primary-600`
      )}
    >
      {split}

      <ul className="flex flex-col space-y-0.5 overflow-hidden rounded pr-1">
        {exercises.map((exercise, index) => {
          const muscleGroup = prioritized_muscle_list.filter(
            (muscle) => muscle.muscle === exercise.muscle
          )[0];
          const setsOverWeek = getExerciseSetsOverMicrocycles(
            exercise.id,
            muscleGroup,
            currentMesocycleIndex,
            microcycles
          );

          return (
            <DataRow
              key={`${index}_exercises_training_block_${exercise.id}`}
              exercise={exercise}
              setProgression={setsOverWeek}
              index={index + 1}
            />
          );
        })}
      </ul>
    </div>
  );
}

function DayHeaderRow({ day }: { day: DayType }) {
  const { training_program_params } = useTrainingProgramContext();
  const { microcycles } = training_program_params;

  const MICROCYCLE_HEADERS = Array.from(
    Array(microcycles),
    (e, i) => `Week ${i + 1}`
  );
  return (
    <div className={"mb-1 flex space-x-1 py-0.5 text-slate-300"}>
      <div className={cn(`pl-1`, CELL_WIDTHS.day)}>
        <DayCell day={day} />
      </div>

      <div className="flex space-x-1 overflow-hidden pr-1">
        <HeaderCellGroup
          data={CELL_WIDTHS.exercise.headers}
          widths={CELL_WIDTHS.exercise.widths}
          bgColor={`bg-primary-700`}
          fontSize="text-xxs"
        />

        {MICROCYCLE_HEADERS.map((each, index) => {
          return (
            <div className={cn(`flex space-x-0.5`)}>
              <HeaderCellGroup
                key={`${each}_MicrocycleHeader_${index}`}
                data={CELL_WIDTHS.week.headers}
                widths={CELL_WIDTHS.week.widths}
                bgColor={`bg-primary-700`}
                fontSize="text-xxs"
              />
            </div>
          );
        })}
        <div className={cn(`flex space-x-0.5`)}>
          <HeaderCellGroup
            data={CELL_WIDTHS.week.headers}
            widths={CELL_WIDTHS.week.widths}
            bgColor={`bg-primary-700`}
            fontSize="text-xxs"
          />
        </div>
      </div>
    </div>
  );
}

type SessionRowProps = {
  training_day: DraggableExercises;
  sessionNumbers: number[];
  currentMesocycleIndex: number;
};
export function SessionRow({
  training_day,
  sessionNumbers,
  currentMesocycleIndex,
}: SessionRowProps) {
  const sessions = training_day.sessions;
  const day = training_day.day;

  if (!sessions.length || sessions[0].split === "off") return null;
  return (
    <div
      className={cn(`flex flex-col rounded border border-primary-500 py-0.5`)}
    >
      <DayHeaderRow day={day} />
      {sessions.map((each, index) => {
        return (
          <SessionSplitRow
            key={`${each.split}_${index}_session`}
            exercises={each.exercises}
            currentMesocycleIndex={currentMesocycleIndex}
            split={
              <SessionCell
                split={each.split}
                sessionNum={sessionNumbers[index]}
              />
            }
          />
        );
      })}
    </div>
  );
}
