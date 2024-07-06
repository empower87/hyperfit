import { ReactNode } from "react";
import { DraggableExercises } from "~/components/TrainingWeekOverview/components/hooks/useExerciseSelection";
import { BG_COLOR_M4, BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import { ExerciseType } from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
import { useTrainingProgramContext } from "~/hooks/useTrainingProgram/useTrainingProgram";
import { cn } from "~/lib/clsx";
import { getRankColor } from "~/utils/getIndicatorColors";
import { ExerciseCell, HeaderCell, SessionCell, WeekCell } from "./Cells";
import { CELL_WIDTHS } from "./constants";

type DataRowProps = {
  exercise: ExerciseType;
  index: number;
};
function DataRow({ exercise, index }: DataRowProps) {
  const details = exercise.mesocycle_progression?.map((each) => {
    return [each.sets, each.reps, each.weight, each.rir];
  });

  const exerciseData = [
    `${index}`,
    exercise.muscle,
    exercise.name,
    exercise.data.requirements[0] ?? "bodyweight",
    exercise.trainingModality,
  ];

  const alternatingBGColors = index % 2 === 0 ? BG_COLOR_M4 : `bg-zinc-400`;
  return (
    <li className={`flex flex-row space-x-1 overflow-hidden`}>
      <ExerciseCell
        data={exerciseData}
        widths={CELL_WIDTHS.exercise.widths}
        bgColor={getRankColor(exercise.rank).bg}
      />

      {details.map((each, index) => {
        return (
          <WeekCell
            key={`${each[0]}_DataRow_${index}`}
            data={each}
            widths={CELL_WIDTHS.week.widths}
            bgColor={`${alternatingBGColors}`}
          />
        );
      })}

      {/* -- for uncoded DELOAD section -- */}
      <WeekCell
        data={details[0]}
        widths={CELL_WIDTHS.week.widths}
        bgColor={`${alternatingBGColors}`}
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
      <div className={`${BG_COLOR_M7} ${CELL_WIDTHS.day} rounded`}>
        <div className={`flex justify-center text-[12px]`}>Day</div>
      </div>

      <HeaderCell label="Exercise">
        <ExerciseCell
          data={CELL_WIDTHS.exercise.headers}
          widths={CELL_WIDTHS.exercise.widths}
          bgColor={`${BG_COLOR_M7}`}
          fontSize="text-xxxs"
        />
      </HeaderCell>

      {MICROCYCLE_HEADERS.map((each, index) => {
        return (
          <HeaderCell label={each} key={`${each}_MicrocycleHeader_${index}`}>
            <WeekCell
              data={CELL_WIDTHS.week.headers}
              widths={CELL_WIDTHS.week.widths}
              bgColor={`${BG_COLOR_M7}`}
              fontSize="text-xxxs"
            />
          </HeaderCell>
        );
      })}

      <HeaderCell label="Deload">
        <WeekCell
          data={CELL_WIDTHS.week.headers}
          widths={CELL_WIDTHS.week.widths}
          bgColor={`${BG_COLOR_M7}`}
          fontSize="text-xxxs"
        />
      </HeaderCell>
    </div>
  );
}

type SessionSplitRowType = {
  exercises: ExerciseType[];
  children: ReactNode;
};

function SessionSplitRow({ exercises, children }: SessionSplitRowType) {
  let count = 0;
  return (
    <div
      className={cn(
        `mb-1 flex rounded ${BG_COLOR_M6} space-x-1 overflow-hidden`
      )}
    >
      {children}

      <ul className="flex flex-col space-y-0.5 overflow-hidden rounded">
        {exercises.map((exercise, index) => {
          return (
            <DataRow
              key={`${index}_exercises_training_block_${exercise.id}`}
              exercise={exercise}
              index={index}
            />
          );
        })}
      </ul>
    </div>
  );
}

type SessionRowProps = {
  training_day: DraggableExercises;
  currentMesocycleIndex: number;
};
export function SessionRow({
  training_day,
  currentMesocycleIndex,
}: SessionRowProps) {
  const sessions = training_day.sessions;
  const day = training_day.day;

  if (!sessions.length || sessions[0].split === "off") return null;
  return (
    <div
      className={cn(`flex flex-col rounded border border-primary-500 py-0.5`)}
    >
      <div
        className={cn(
          `flex justify-center pb-1 text-sm font-semibold text-primary-800`,
          CELL_WIDTHS.day
        )}
      >
        {day.slice(0, 3)}
      </div>

      {sessions.map((each, index) => {
        return (
          <SessionSplitRow
            key={`${each.split}_${index}_session`}
            exercises={each.exercises}
          >
            <SessionCell split={each.split} />
          </SessionSplitRow>
        );
      })}
    </div>
  );
}
