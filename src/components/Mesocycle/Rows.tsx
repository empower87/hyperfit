import {
  DayType,
  ExerciseType,
  SessionDayType,
  SplitType,
} from "~/hooks/useWeeklySessionSplit/reducer/weeklySessionSplitReducer";
import { ExerciseCell, HeaderCell, MicrocycleCell, SessionCell } from "./Cells";
import {
  ROW_CELL_WIDTHS,
  ROW_SECTION_WIDTHS,
  SESSION_HEADERS,
  WEEK_ONE_HEADERS,
  WEEK_TWO_TO_FOUR_HEADERS,
} from "./constants";

type DataRowProps = {
  exercise: ExerciseType;
  split: SplitType;
  index: number;
  currentMesocycleIndex: number;
  position: "first" | "last" | "mid";
};
type HeaderRowProps = {
  sessionHeader: DayType | null;
};

function DataRow({
  exercise,
  split,
  index,
  currentMesocycleIndex,
  position,
}: DataRowProps) {
  const details = exercise.meso_details[currentMesocycleIndex];
  if (!details) return null;

  return (
    <div className="flex flex-row">
      <SessionCell split={split} index={index} width={ROW_SECTION_WIDTHS[0]} />
      <ExerciseCell
        exercise={exercise}
        index={index}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
        position={position}
      />
      <MicrocycleCell
        week="week 1"
        details={details}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
        position={position}
      />
      <MicrocycleCell
        week="week 2"
        details={details}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
        position={position}
      />
      <MicrocycleCell
        week="week 3"
        details={details}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
        position={position}
      />
      <MicrocycleCell
        week="week 4"
        details={details}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
        position={position}
      />
      <MicrocycleCell
        week="deload"
        details={details}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
        position={position}
      />
    </div>
  );
}

const HeaderRow = ({ sessionHeader }: HeaderRowProps) => {
  return (
    <div className="mb-1 flex flex-row">
      <HeaderCell
        values={sessionHeader ? [sessionHeader] : [""]}
        width={ROW_SECTION_WIDTHS[0]}
        cellWidths={ROW_CELL_WIDTHS["session"]}
      />
      <HeaderCell
        values={SESSION_HEADERS}
        width={ROW_SECTION_WIDTHS[1]}
        cellWidths={ROW_CELL_WIDTHS["exercise"]}
      />
      <HeaderCell
        values={WEEK_ONE_HEADERS}
        width={ROW_SECTION_WIDTHS[2]}
        cellWidths={ROW_CELL_WIDTHS["week 1"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[3]}
        cellWidths={ROW_CELL_WIDTHS["week 2"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[4]}
        cellWidths={ROW_CELL_WIDTHS["week 3"]}
      />
      <HeaderCell
        values={WEEK_TWO_TO_FOUR_HEADERS}
        width={ROW_SECTION_WIDTHS[5]}
        cellWidths={ROW_CELL_WIDTHS["week 4"]}
      />
      <HeaderCell
        values={WEEK_ONE_HEADERS}
        width={ROW_SECTION_WIDTHS[6]}
        cellWidths={ROW_CELL_WIDTHS["deload"]}
      />
    </div>
  );
};

type SessionSplitRowType = {
  day: DayType;
  sessionSplitIndex: 0 | 1;
  split: SplitType;
  exercises: ExerciseType[][];
  currentMesocycleIndex: number;
};

function SessionSplitRow({
  day,
  sessionSplitIndex,
  split,
  exercises,
  currentMesocycleIndex,
}: SessionSplitRowType) {
  let count = 0;

  const firstIndex = 0;
  const lastIndex = exercises.length - 1;

  return (
    <div className="mb-1 flex flex-col">
      {sessionSplitIndex === 0 ? <HeaderRow sessionHeader={day} /> : null}

      <div className="flex flex-col">
        {exercises.map((exerciseSet, one) => {
          const lastLastIndex = exerciseSet.length - 1;
          return exerciseSet.map((exercise, two) => {
            count++;
            const position =
              lastIndex === one && lastLastIndex === two
                ? "last"
                : firstIndex === one && two === firstIndex
                ? "first"
                : "mid";
            return (
              <DataRow
                split={split}
                exercise={exercise}
                index={count}
                currentMesocycleIndex={currentMesocycleIndex}
                position={position}
              />
            );
          });
        })}
      </div>
    </div>
  );
}

type SessionRowProps = { split: SessionDayType; currentMesocycleIndex: number };

function SessionRow({ split, currentMesocycleIndex }: SessionRowProps) {
  const sets_one = split.sets[0];
  const sets_two = split.sets[1];

  return (
    <div className="m-1 box-border flex flex-col border border-slate-300 bg-slate-100 shadow-md">
      {sets_one.length ? (
        <SessionSplitRow
          day={split.day}
          split={split.sessions[0]}
          exercises={sets_one}
          currentMesocycleIndex={currentMesocycleIndex}
          sessionSplitIndex={0}
        />
      ) : null}
      {sets_two.length ? (
        <SessionSplitRow
          day={split.day}
          split={split.sessions[1]}
          exercises={sets_two}
          currentMesocycleIndex={currentMesocycleIndex}
          sessionSplitIndex={1}
        />
      ) : null}
    </div>
  );
}

export { DataRow, HeaderRow, SessionRow };
