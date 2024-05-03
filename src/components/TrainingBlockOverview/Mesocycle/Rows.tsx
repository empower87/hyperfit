import { ReactNode } from "react";
import { BG_COLOR_M4, BG_COLOR_M6, BG_COLOR_M7 } from "~/constants/themes";
import {
  ExerciseType,
  TrainingDayType,
} from "~/hooks/useTrainingProgram/reducer/trainingProgramReducer";
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
  const details = exercise.mesocycle_progression.map((each) => {
    return [each.sets, each.reps, each.weight, each.rir];
  });

  const exerciseData = [
    `${index}`,
    exercise.muscle,
    exercise.exercise,
    "dumbbell",
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
  exercises: ExerciseType[][];
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
        {exercises.map((exerciseSet, index) => {
          return exerciseSet.map((exercise, two) => {
            count++;
            return (
              <DataRow
                key={`${index}_exercises_training_block_${exercise.id}`}
                exercise={exercise}
                index={count}
              />
            );
          });
        })}
      </ul>
    </div>
  );
}

type SessionRowProps = {
  training_day: TrainingDayType;
  currentMesocycleIndex: number;
};
export function SessionRow({
  training_day,
  currentMesocycleIndex,
}: SessionRowProps) {
  const sessions = training_day.sessions;
  const day = training_day.day;

  if (!sessions.length) return null;
  return (
    <div className={cn(`flex flex-col`)}>
      {sessions.map((each, index) => {
        return (
          <SessionSplitRow
            key={`${each.split}_${index}_session`}
            exercises={each.exercises}
          >
            <SessionCell split={each.split}>
              {index === 0 ? (
                <div
                  className={`flex items-start text-[10px] font-semibold text-slate-800`}
                >
                  {day.charAt(0) + day.charAt(1)}
                </div>
              ) : null}
            </SessionCell>
          </SessionSplitRow>
        );
      })}
    </div>
  );
}
